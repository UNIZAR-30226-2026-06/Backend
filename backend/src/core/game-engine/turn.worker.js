const { activeGames } = require('./game.registry');
const { runGameCycle } = require('./game.runner');

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