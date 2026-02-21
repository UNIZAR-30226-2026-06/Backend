// src/core/game-engine/game.logic.js

class GameLogic {
  constructor(gameState) {
    this.state = gameState;
    this.turnManager = new TurnManager(this.state);
  }

  shuffle(deck) {
    const copy = [...deck];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  recycleIfNeeded() {
    if (this.state.drawPile.length > 0) return;

    if (this.state.discardPile.length <= 1) {
      throw new Error('No quedan cartas para robar');
    }

    const currentCard = this.state.removeTopDiscard();
    const newPile = this.shuffle(this.state.discardPile);

    this.state.setDrawPile(newPile);
    this.state.setDiscardPile([currentCard]);
  }

  drawCard() {
    this.recycleIfNeeded();
    return this.state.drawFromPile();
  }

  startGame(deck) {
    if (this.state.status !== 'waiting')
      throw new Error('La partida ya ha comenzado');

    if (this.state.players.length < 2)
      throw new Error('Se necesitan al menos 2 jugadores');

    const totalNeeded =
      this.state.players.length * this.state.numCardsIni + 1;

    if (deck.length < totalNeeded)
      throw new Error('No hay suficientes cartas');

    const shuffled = this.shuffle(deck);

    this.state.setStatus('playing');
    this.state.resetTurn();
    this.state.setDirection(1);
    this.state.setDrawPile(shuffled);
    this.state.setDiscardPile([]);
    this.state.clearHands();

    // repartir cartas
    for (let i = 0; i < this.state.numCardsIni; i++) {
      for (const player of this.state.players) {
        const card = this.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }

    // carta inicial
    const initialCard = this.drawCard();
    this.state.setCurrentCard(initialCard);
    this.state.addToDiscardPile(initialCard);
  }

  playCard(playerId, card) {
    if (this.state.status !== 'playing')
      throw new Error('La partida no está en juego');

    const currentPlayer = this.state.getCurrentPlayer();

    if (currentPlayer.id !== playerId)
      throw new Error('No es el turno del jugador');

    // aquí irán validaciones de reglas: color, número, carta especial ...

    this.state.removeCardFromPlayer(playerId, card);
    this.state.setCurrentCard(card);
    this.state.addToDiscardPile(card);

    this.turnManager.next();
  }

  pauseGame() {
    this.state.setStatus('paused');
  }

  endGame() {
    this.state.setStatus('finished');
  }
}

const TurnManager = require('./turn.manager');

module.exports = GameLogic;