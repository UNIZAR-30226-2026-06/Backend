const db = require('../../config/db');
const GameState = require('../../core/game-engine/game.state');
const GameLogic = require('../../core/game-engine/game.logic');

// Map en memoria para partidas activas
const activeGames = new Map();

async function crearPartida(id_creador, config) {
  const initialState = new GameState({
    id: null,
    players: [{ userId: id_creador }],
    numCardsIni: config.numCartasInicio,
    specialCardsMode: config.modoCartasEspeciales,
    rolesMode: config.modoRoles
  });

  const result = await db.query(
    `INSERT INTO notuno.partida
     (num_cartas_inicio, modo_cartas_especiales, modo_roles, sonido, musica, vibracion,
      estado, timeout_turno, max_jugadores, partida_publica, game_state)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id_partida, estado`,
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
      config.partidaPublica ?? true,
      initialState
    ]
  );

  const partida = result.rows[0];
  initialState.id = partida.id_partida;

  // Guardamos en memoria para juego en tiempo real
  activeGames.set(partida.id_partida, initialState);

  return partida;
}

async function unirsePartida(gameId, username) {
  const gameState = activeGames.get(gameId);
  if (!gameState) throw new Error('Partida no encontrada en memoria');

  if (gameState.players.find(p => p.id === username)) {
    return { message: 'Jugador ya estaba en la partida' };
  }

  // Añadimos jugador
  gameState.players.push({ id: username, hand: [], rol: null, rolUses: 0, connected: true, isBot: false, saidUno: false });

  await db.query(
    `INSERT INTO notuno.usuario_en_partida (id_partida, id_usuario)
     VALUES ($1,$2)`,
    [gameId, username]
  );

  return { message: 'Jugador unido a la partida' };
}

async function empezarPartida(gameId, username) {
  const gameState = activeGames.get(gameId);
  if (!gameState) throw new Error('Partida no encontrada en memoria');

  const logic = new GameLogic(gameState);
  logic.startGame();

  // Actualizamos DB: cambiamos estado y guardamos game_state inicial
  await db.query(
    `UPDATE notuno.partida
     SET estado = 'en_curso', game_state = $2
     WHERE id_partida = $1`,
    [gameId, gameState]
  );

  return { message: 'Partida iniciada' };
}

async function obtenerPartida(gameId) {
  const result = await db.query(
    `SELECT id_partida, estado, max_jugadores
     FROM notuno.partida
     WHERE id_partida = $1`,
    [gameId]
  );

  return result.rows[0];
}

async function obtenerEstadoPartida(gameId, username) {
  const gameState = activeGames.get(gameId);
  if (!gameState) throw new Error('Partida no encontrada en memoria');

  // Clonamos para no exponer referencias internas
  const state = JSON.parse(JSON.stringify(gameState));

  const filteredPlayers = state.players.map(p => {
    if (p.id === username) return p;
    return {
      id: p.id,
      hand: p.hand.length,
      rol: p.rol,
      rolUses: p.rolUses,
      connected: p.connected,
      isBot: p.isBot,
      saidUno: p.saidUno
    };
  });

  return {
    gameId,
    phase: state.phase,
    currentTurn: state.currentTurn,
    direction: state.direction,
    turnDeadline: state.turnDeadline,
    drawPileCount: state.drawPile.length,
    discardPileTop: state.discardPile[state.discardPile.length - 1] || null,
    pendingDraw: state.pendingDraw,
    skipNext: state.skipNext,
    players: filteredPlayers,
    numCardsIni: state.numCardsIni,
    specialCardsMode: state.specialCardsMode,
    rolesMode: state.rolesMode
  };
}

/**
 * Guardar partida en DB cuando se pausa o finaliza
 */
async function persistirPartida(gameId) {
  const gameState = activeGames.get(gameId);
  if (!gameState) return;

  await db.query(
    `UPDATE notuno.partida
     SET game_state = $2, estado = $3
     WHERE id_partida = $1`,
    [gameId, gameState, gameState.phase]
  );

  if (gameState.phase === 'finished') {
    activeGames.delete(gameId); // limpiar memoria
  }
}

module.exports = {
  crearPartida,
  unirsePartida,
  empezarPartida,
  obtenerPartida,
  obtenerEstadoPartida,
  persistirPartida
};