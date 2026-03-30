const { activeGames } = require('../../modules/game/gameService');
const GameLogic = require('./game.logic');
const { resolveTimeoutIfNeeded } = require('./game.utils');
const db = require('../../config/db');

const POLL_INTERVAL = 2000;

function startTurnWorker() {
  setInterval(async () => {
    for (const [gameId, gameState] of activeGames.entries()) {
      try {
        const logic = new GameLogic(gameState);

        // Resolver timeout usando la función central
        resolveTimeoutIfNeeded(logic);

        await db.query(
          `UPDATE notuno.partida
           SET game_state = $2, updated_at = NOW()
           WHERE id_partida = $1`,
          [gameId, gameState]
        );

      } catch (err) {
        console.error(`TurnWorker error en partida ${gameId}:`, err);
      }
    }
  }, POLL_INTERVAL);
}

module.exports = { startTurnWorker };
