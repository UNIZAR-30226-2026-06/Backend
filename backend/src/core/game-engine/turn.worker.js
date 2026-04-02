<<<<<<< Updated upstream
const { activeGames } = require('../../modules/game/gameService');
const GameLogic = require('./game.logic');
const { resolveTimeoutIfNeeded } = require('./game.utils');
const db = require('../../config/db');
=======
const { activeGames } = require('./game.registry');
const { runGameCycle } = require('./game.runner');
>>>>>>> Stashed changes

const POLL_INTERVAL = 2000;

function startTurnWorker() {
  setInterval(async () => {
    for (const [gameId] of activeGames.entries()) {
      try {
        await runGameCycle(gameId);
      } catch (err) {
        console.error(`TurnWorker error en partida ${gameId}:`, err);
      }
    }
  }, POLL_INTERVAL);
}

module.exports = { startTurnWorker };