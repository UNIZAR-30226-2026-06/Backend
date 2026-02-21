// src/core/game-engine/game.state.js

class GameState {
  constructor({ id, players, numCardsIni, specialCardsMode, rolesMode }) {
    this.id = id;
    this.status = 'waiting';

    this.players = players.map((p, index) => ({
      id: p.userId,
      hand: [],
      rol: p.id_rol || null,
      rolUses: p.rolUsesGame || 0,
      turnOrder: index
    }));

    this.currentTurn = 0;
    this.direction = 1;

    this.drawPile = [];
    this.discardPile = [];
    this.currentCard = null;

    this.numCardsIni = numCardsIni;
    this.specialCardsMode = specialCardsMode;
    this.rolesMode = rolesMode;
  }

  //  Getters

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  getPlayerById(id) {
    return this.players.find(p => p.id === id);
  }

  //  Operaciones simples

  setStatus(status) {
    this.status = status;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  resetTurn() {
    this.currentTurn = 0;
  }

  setCurrentTurnIndex(index) {
    this.currentTurn = index;
  }

  setDrawPile(pile) {
    this.drawPile = pile;
  }

  setDiscardPile(pile) {
    this.discardPile = pile;
  }

  clearHands() {
    this.players.forEach(p => p.hand = []);
  }

  setCurrentCard(card) {
    this.currentCard = card;
  }

  addCardToPlayer(playerId, card) {
    const player = this.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');
    player.hand.push(card);
  }

  removeCardFromPlayer(playerId, card) {
    const player = this.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');

    const index = player.hand.findIndex(c => c.id === card.id);
    if (index === -1) throw new Error('Carta no en mano');

    player.hand.splice(index, 1);
  }

  addToDiscardPile(card) {
    this.discardPile.push(card);
  }

  removeTopDiscard() {
    return this.discardPile.pop();
  }

  drawFromPile() {
    return this.drawPile.shift();
  }

  getPlayersCount() {
    return this.players.length; 
  }

  getCurrentTurnIndex() {
    return this.currentTurn;
  }

  getDirection() {
    return this.direction;
  }
  
}


module.exports = GameState;