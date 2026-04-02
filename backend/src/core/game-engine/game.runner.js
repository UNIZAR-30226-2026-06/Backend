// src/core/game/game.runner.js
const { withGameLock } = require('./lock.manager');
const db = require('../../config/db');
const GameLogic = require('./game.logic');
const { cargarPartidaEnMemoria } = require('./game.loader');
const { activeGames } = require('./game.registry');

/**
 * Ejecuta un ciclo de juego seguro con lock por partida.
 * @param {string} gameId 
 * @param {Function|null} actionFn - Función opcional que recibe (logic, gameState)
 * @returns {GameState}
 */
async function runGameCycle(gameId, actionFn = null) {
  return withGameLock(gameId, async () => {
    let gameState = activeGames.get(gameId);

    // Cargar desde DB si no está en memoria
    if (!gameState) {
      gameState = await cargarPartidaEnMemoria(gameId);
    }

    const logic = new GameLogic(gameState);

    // Resolver timeout de turno si corresponde
    logic.resolveTimeoutIfNeeded();

    // Ejecutar acción externa si se pasó
    if (actionFn) {
      await actionFn(logic, gameState);
    }

    // Persistencia opcional
    if (gameState.needsPersistence) {
      await db.query(
        `UPDATE notuno.partida SET game_state=$2, updated_at=NOW() WHERE id_partida=$1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false; // resetear flag
    }

    return gameState;
  });
}

module.exports = { runGameCycle };
