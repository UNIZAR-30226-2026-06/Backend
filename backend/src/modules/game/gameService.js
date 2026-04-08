// src/modules/game/gameService.js
const db = require('../../config/db');
const GameState = require('../../core/game-engine/game.state');
const { activeGames } = require('../../core/game-engine/game.registry');
const { runGameCycle } = require('../../core/game-engine/game.runner');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// =========================
// UTILS
// =========================

function generarCodigo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

async function generarCodigoUnico() {
  let codigo;
  let exists = true;

  while (exists) {
    codigo = generarCodigo();
    const result = await db.query(
      'SELECT 1 FROM notuno.partida WHERE codigo = $1',
      [codigo]
    );
    exists = result.rowCount > 0;
  }

  return codigo;
}

// =========================
// VALIDACIÓN
// =========================

function validarConfig(config) {
  if (!config.maxJugadores || config.maxJugadores < 2 || config.maxJugadores > 4) {
    throw new Error('maxJugadores inválido');
  }
  if (config.numCartasInicio && config.numCartasInicio <= 0) {
    throw new Error('numCartasInicio inválido');
  }
  if (config.timeoutTurno && config.timeoutTurno <= 0) {
    throw new Error('timeoutTurno inválido');
  }
}

// =========================
// REHIDRATAR PARTIDA
// =========================

async function cargarPartidaEnMemoria(gameId) {
  const result = await db.query(
    `SELECT game_state FROM notuno.partida WHERE id_partida = $1`,
    [gameId]
  );

  if (result.rowCount === 0) throw new Error('Partida no encontrada en DB');

  const savedState = result.rows[0].game_state;
  if (!savedState) throw new Error('Partida sin estado guardado');

  const parsedState = typeof savedState === 'string' ? JSON.parse(savedState) : savedState;
  const gameState = new GameState(parsedState);

  activeGames.set(gameId, gameState);
  return gameState;
}

// =========================
// CREAR PARTIDA
// =========================

async function crearPartida(id_creador, config) {
  validarConfig(config);

  let codigo = null;
  if (config.privada) codigo = await generarCodigoUnico();

  const client = await db.connect();

  const initialState = new GameState({
    id: null,
    players: [{
      id: id_creador,
      hand: [],
      rol: null,
      rolUses: 0,
      connected: true,
      isBot: false,
      saidUno: false
    }],
    numCardsIni: config.numCartasInicio,
    specialCardsMode: config.modoCartasEspeciales,
    rolesMode: config.modoRoles,
    phase: 'waiting'
  });

  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO notuno.partida
       (num_cartas_inicio, modo_cartas_especiales, modo_roles,
        sonido, musica, vibracion,
        estado, timeout_turno, max_jugadores,
        partida_publica, codigo, game_state)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id_partida, codigo`,
      [
        config.numCartasInicio,
        config.modoCartasEspeciales,
        config.modoRoles,
        config.sonido ?? true,
        config.musica ?? true,
        config.vibracion ?? true,
        'esperando_jugadores',
        config.timeoutTurno ?? 30,
        config.maxJugadores,
        !config.privada,
        codigo,
        JSON.stringify(initialState)
      ]
    );

    const partida = result.rows[0];

    await client.query(
      `INSERT INTO notuno.usuario_en_partida (id_partida, id_usuario) VALUES ($1,$2)`,
      [partida.id_partida, id_creador]
    );

    initialState.id = partida.id_partida;
    await client.query(
      `UPDATE notuno.partida SET game_state = $2 WHERE id_partida = $1`,
      [partida.id_partida, JSON.stringify(initialState)]
    );

    await client.query('COMMIT');

    activeGames.set(partida.id_partida, initialState);

    return partida;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// =========================
// INICIAR PARTIDA
// =========================

async function iniciarPartida(gameId, username) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const lock = await client.query(
      `SELECT estado FROM notuno.partida WHERE id_partida = $1 FOR UPDATE`,
      [gameId]
    );

    if (lock.rowCount === 0) throw httpError(404, 'Partida no encontrada');

    let gameState = activeGames.get(gameId) || await cargarPartidaEnMemoria(gameId);
    const owner = gameState.players[0]?.id;

    if (owner !== username) throw httpError(403, 'Solo el creador puede iniciar la partida');
    if (gameState.phase !== 'waiting') throw httpError(400, 'La partida ya fue iniciada');

    const GameLogic = require('../../core/game-engine/game.logic');
    const logic = new GameLogic(gameState);
    logic.startGame();

    await client.query(
      `UPDATE notuno.partida
       SET estado = 'en_curso', game_state = $2, updated_at = NOW()
       WHERE id_partida = $1`,
      [gameId, gameState]
    );

    await client.query('COMMIT');
    return { started: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// =========================
// UNIRSE POR ID
// =========================

async function unirsePartida(gameId, username) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const partidaResult = await client.query(
      `SELECT max_jugadores, estado
       FROM notuno.partida
       WHERE id_partida = $1
       FOR UPDATE`,
      [gameId]
    );

    if (partidaResult.rowCount === 0) throw new Error('Partida no encontrada');

    const { max_jugadores, estado } = partidaResult.rows[0];
    if (estado !== 'esperando_jugadores') throw new Error('La partida no admite jugadores');

    const jugadoresResult = await client.query(
      `SELECT COUNT(*) FROM notuno.usuario_en_partida WHERE id_partida = $1`,
      [gameId]
    );

    if (parseInt(jugadoresResult.rows[0].count) >= max_jugadores) {
      throw new Error('Partida llena');
    }

    const exists = await client.query(
      `SELECT 1 FROM notuno.usuario_en_partida WHERE id_partida = $1 AND id_usuario = $2`,
      [gameId, username]
    );

    if (exists.rowCount === 0) {
      await client.query(
        `INSERT INTO notuno.usuario_en_partida (id_partida, id_usuario) VALUES ($1,$2)`,
        [gameId, username]
      );
    }

    await client.query('COMMIT');

    let gameState = activeGames.get(gameId) || await cargarPartidaEnMemoria(gameId);

    if (!gameState.players.find(p => p.id === username)) {
      gameState.players.push({
        id: username,
        hand: [],
        rol: null,
        rolUses: 0,
        connected: true,
        isBot: false,
        saidUno: false
      });
      gameState.needsPersistence = true;
    }

    if (gameState.needsPersistence) {
      await db.query(
        `UPDATE notuno.partida SET game_state = $2 WHERE id_partida = $1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false;
    }

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function unirsePrimeraPartidaPublica(username) {
  const client = await db.connect();
  let gameId;

  try {
    await client.query('BEGIN');

    const candidata = await client.query(
      `SELECT p.id_partida
       FROM notuno.partida p
       WHERE p.partida_publica = TRUE
         AND p.estado = 'esperando_jugadores'
         AND (
           SELECT COUNT(*)
           FROM notuno.usuario_en_partida up
           WHERE up.id_partida = p.id_partida
         ) < p.max_jugadores
       ORDER BY p.id_partida ASC
       FOR UPDATE SKIP LOCKED
       LIMIT 1`
    );

    if (candidata.rowCount === 0) {
      throw httpError(404, 'No hay partidas publicas disponibles');
    }

    gameId = candidata.rows[0].id_partida;

    const exists = await client.query(
      `SELECT 1 FROM notuno.usuario_en_partida WHERE id_partida = $1 AND id_usuario = $2`,
      [gameId, username]
    );

    if (exists.rowCount === 0) {
      await client.query(
        `INSERT INTO notuno.usuario_en_partida (id_partida, id_usuario) VALUES ($1,$2)`,
        [gameId, username]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  const gameState = activeGames.get(gameId) || await cargarPartidaEnMemoria(gameId);

  if (!gameState.players.find((p) => p.id === username)) {
    gameState.players.push({
      id: username,
      hand: [],
      rol: null,
      rolUses: 0,
      connected: true,
      isBot: false,
      saidUno: false
    });
    gameState.needsPersistence = true;
  }

  if (gameState.needsPersistence) {
    await db.query(
      `UPDATE notuno.partida SET game_state = $2 WHERE id_partida = $1`,
      [gameId, JSON.stringify(gameState)]
    );
    gameState.needsPersistence = false;
  }

  return { gameId };
}

// =========================
// UNIRSE POR CÓDIGO
// =========================

async function unirsePorCodigo(codigo, username) {
  const result = await db.query(
    `SELECT id_partida FROM notuno.partida WHERE codigo = $1`,
    [codigo]
  );
  if (result.rowCount === 0) throw new Error('Código inválido');

  return await unirsePartida(result.rows[0].id_partida, username);
}

// =========================
// ESTADO COMPLETO
// =========================

async function obtenerEstadoPartida(gameId, username) {
  let gameState = activeGames.get(gameId) || await cargarPartidaEnMemoria(gameId);
  const state = JSON.parse(JSON.stringify(gameState));

  const players = state.players.map(p => {
    if (p.id === username) return p;
    return {
      id: p.id,
      hand: p.hand.length,
      connected: p.connected,
      isBot: p.isBot,
      saidUno: p.saidUno
    };
  });

  return {
    gameId,
    phase: state.phase,
    currentTurn: state.players?.[state.currentTurn]?.id || null,
    direction: state.direction,
    discardTop: state.discardPile?.at(-1) || null,
    drawCount: state.drawPile?.length || 0,
    players
  };
}

// =========================
// INFO LOBBY
// =========================

async function obtenerPartida(gameId) {
  const result = await db.query(
    `SELECT id_partida, estado, max_jugadores FROM notuno.partida WHERE id_partida = $1`,
    [gameId]
  );

  if (result.rowCount === 0) throw new Error('Partida no encontrada');

  const jugadores = await db.query(
    `SELECT id_usuario FROM notuno.usuario_en_partida WHERE id_partida = $1`,
    [gameId]
  );

  return {
    gameId: result.rows[0].id_partida,
    estado: result.rows[0].estado,
    maxJugadores: result.rows[0].max_jugadores,
    jugadores: jugadores.rows.map(j => j.id_usuario)
  };
}

// =========================
// FINALIZAR PARTIDA
// =========================

async function finalizarPartida(gameId, username) {
  return runGameCycle(gameId, async (logic, gameState) => {
    const owner = gameState.players[0]?.id;
    if (owner !== username) throw new Error('No autorizado para finalizar la partida');

    gameState.phase = 'finished';

    await db.query(
      `UPDATE notuno.partida SET estado=$2, game_state=$3 WHERE id_partida=$1`,
      [gameId, 'finished', JSON.stringify(gameState)]
    );

    activeGames.delete(gameId);

    return { message: 'Partida finalizada' };
  });
}

// =========================
// JUGAR CARTA
// =========================

async function jugarCarta(gameId, username, cardId) {
  return runGameCycle(gameId, async (logic, gameState) => {
    if (gameState.phase !== 'playing') throw new Error('La partida no está en juego');

    const current = gameState.getCurrentPlayer();
    if (current.id !== username) throw httpError(403, 'No es tu turno');

    const player = gameState.getPlayerById(username);
    if (!player) throw httpError(403, 'Jugador no está en la partida');

    if (!cardId) throw httpError(400, 'cardId es requerido');

    const card = player.hand.find(c => c.id === cardId);
    if (!card) throw httpError(400, 'Carta no pertenece al jugador');

    logic.playCard(username, card);
    gameState.needsPersistence = true;

    if (gameState.needsPersistence) {
      await db.query(
        `UPDATE notuno.partida SET game_state=$2 WHERE id_partida=$1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false;
    }

    return { success: true };
  });
}

// =========================
// ROBAR CARTA
// =========================

async function robarCarta(gameId, username) {
  return runGameCycle(gameId, async (logic, gameState) => {
    if (gameState.phase !== 'playing') throw new Error('La partida no está en juego');

    const current = gameState.getCurrentPlayer();
    if (current.id !== username) throw httpError(403, 'No es tu turno');

    const card = logic.drawCard();
    gameState.addCardToPlayer(username, card);
    gameState.advanceTurn();
    gameState.setNewTurnDeadline(30000);
    gameState.needsPersistence = true;

    if (gameState.needsPersistence) {
      await db.query(
        `UPDATE notuno.partida SET game_state=$2 WHERE id_partida=$1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false;
    }

    return { cardDrawn: card };
  });
}


// =========================
// AÑADIR BOT A LA PARTIDA
// =========================
async function añadirBot(gameId, usernameCreador) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    // Cargar partida
    let gameState = activeGames.get(gameId) || await cargarPartidaEnMemoria(gameId);
    
    // Validar que solo el creador pueda añadir bots y que la partida no haya empezado
    if (gameState.players[0].id !== usernameCreador) {
      throw new Error('Solo el creador puede añadir bots');
    }
    if (gameState.phase !== 'waiting') {
      throw new Error('La partida ya ha comenzado');
    }
    
    // Generar un ID único para el bot
    const botId = `Bot_${Math.floor(Math.random() * 10000)}`;
    
    // Añadir al estado del juego
    gameState.players.push({
      id: botId,
      hand: [],
      rol: null,
      rolUses: 0,
      connected: true, // Siempre "conectado"
      isBot: true,     // Bandera clave
      saidUno: false
    });
    
    gameState.needsPersistence = true;
    
    // Persistir el estado modificado
    await client.query(
      `UPDATE notuno.partida SET game_state = $2 WHERE id_partida = $1`,
      [gameId, JSON.stringify(gameState)]
    );
    
    await client.query('COMMIT');
    return { success: true, botId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


async function getCarta(idcarta) {
  //funcion que devuelve la carta a partir de su id, con toda su informacion (color, numero, tipo...)
  const result = await db.query(`SELECT * FROM notuno.carta WHERE id_carta = $1`, [idcarta]);
  return result.rows[0];
}

// =========================
// SISTEMA DE PAUSA
// =========================

async function votarPausa(gameId, username) {
  return runGameCycle(gameId, async (logic, gameState) => {
    if (gameState.phase !== 'playing') {
      throw new Error('Solo se puede pausar una partida en juego');
    }

    // 1 sola persona pausa la partida al instante. 
    // ¡Ya NO llamamos a addPauseVote!
    gameState.setPaused();
    gameState.needsPersistence = true;
    
    return { action: 'pausada', solicitante: username };
  });
}

async function reanudarPartida(gameId, username) {
  return runGameCycle(gameId, async (logic, gameState) => {
    if (gameState.phase !== 'paused') {
      throw new Error('La partida no está pausada');
    }

    // Registramos el voto de esta persona para reanudar
    gameState.addResumeVote(username);

    // Comprobamos si con este voto se alcanza la MAYORÍA
    if (gameState.hasMajorityResumeVotes()) {
      gameState.setResumed(30000);
      gameState.needsPersistence = true;
      return { action: 'reanudada' };
    } else {
      gameState.needsPersistence = true;
      return { action: 'voto_reanudar_registrado', votosActuales: gameState.resumeVotes.length };
    }
  });
}

module.exports = {
  crearPartida,
  iniciarPartida,
  unirsePartida,
  unirsePrimeraPartidaPublica,
  unirsePorCodigo,
  cargarPartidaEnMemoria,
  obtenerEstadoPartida,
  obtenerPartida,
  finalizarPartida,
  jugarCarta,
  robarCarta,
  getCarta,
  activeGames,
  añadirBot,
  votarPausa,
  reanudarPartida
};
