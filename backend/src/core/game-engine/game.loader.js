// src/core/game/game.loader.js
const db = require('../../config/db');
const GameState = require('./game.state');
const { activeGames } = require('./game.registry');

async function cargarPartidaEnMemoria(gameId) {
  // Traer datos de la partida
  const { rows: partidaRows } = await db.query(
    'SELECT * FROM PARTIDA WHERE id_partida=$1',
    [gameId]
  );
  if (!partidaRows.length) throw new Error('Partida no encontrada');

  const partidaBD = partidaRows[0];

  // Traer jugadores asociados a esta partida
  const { rows: jugadorRows } = await db.query(
    'SELECT u.id_usuario, u.nombre_usuario, gp.is_bot, gp.rol, gp.rol_uses, gp.said_uno ' +
    'FROM PARTIDA_JUGADOR gp ' +
    'JOIN USUARIO u ON gp.id_usuario = u.id_usuario ' +
    'WHERE gp.id_partida=$1 ORDER BY gp.orden ASC',
    [gameId]
  );

  const players = jugadorRows.map(j => ({
    id: j.id_usuario,
    nombre: j.nombre_usuario,
    isBot: j.is_bot,
    rol: j.rol,
    rolUses: j.rol_uses,
    saidUno: j.said_uno
  }));

  // Crear GameState
  const gameState = new GameState({
    id: partidaBD.id_partida,
    players,
    numCardsIni: partidaBD.num_cartas_inicio,
    specialCardsMode: partidaBD.modo_cartas_especiales,
    rolesMode: partidaBD.modo_roles
  });

  // Si tienes info de drawPile / discardPile guardada en JSON, puedes inicializarla aquí
  if (partidaBD.game_state) {
    Object.assign(gameState, partidaBD.game_state);
  }

  // Registrar en memoria
  activeGames.set(gameId, gameState);
  return gameState;
}

module.exports = { cargarPartidaEnMemoria };
