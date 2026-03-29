// backend/src/core/game-engine/game.utils.js
const db = require('../../config/db');
const GameLogic = require('./game.logic');

function resolveTimeoutIfNeeded(gameLogic) {
  const state = gameLogic.state;

  // 1️⃣ Si no hay turno expirado, salir
  if (!state.isTurnExpired()) return false;

  const currentPlayer = state.getCurrentPlayer();

  // 2️⃣ Decisión del bot (si es bot) o turno expirado
  let decision;
  if (currentPlayer.isBot) {
    decision = gameLogic.botLogic.decideMove(currentPlayer.id);
  } else {
    // jugador humano que no jugó a tiempo → forzar robo
    decision = { type: 'draw' };
  }

  // 3️⃣ Ejecutar acción según tipo
  if (decision.type === 'draw') {
    const card = gameLogic.drawCard();
    state.addCardToPlayer(currentPlayer.id, card);

    // Avanzar turno
    gameLogic.turnManager.next();
    state.setNewTurnDeadline(30000);

  } else if (decision.type === 'play') {
    gameLogic.playCard(currentPlayer.id, decision.card);
  }

  return true; // indica que se ejecutó una acción por timeout
}

module.exports = { resolveTimeoutIfNeeded };
