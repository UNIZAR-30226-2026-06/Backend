// src/core/game-engine/game.state.js

class GameState {
  constructor({ id, players, numCardsIni, specialCardsMode, rolesMode }) {
    this.id = id;
    this.phase = 'waiting'; // waiting, playing, finished

    this.players = players.map((p) => ({
      id: p.userId,
      hand: [],
      rol: p.id_rol || null,
      rolUses: p.rolUsesGame || 0,
      connected: true,
      isBot: false,
      saidUno: false
    }));

    this.currentTurn = 0;
    this.direction = 1; // 1 = normal, -1 = reversed

    this.turnDeadline = null; // timestamp en ms

    this.drawPile = [];
    this.discardPile = [];

    this.pendingDraw = 0; // acumulado de +2 o +4
    this.skipNext = false; // skip activado por carta

    this.numCardsIni = numCardsIni;
    this.specialCardsMode = specialCardsMode;
    this.rolesMode = rolesMode;

    this.createdAt = Date.now();
    this.lastShuffle = null; // para debug y reconstrucción
  }

  // ======================
  // Getters
  // ======================

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  getPlayerById(id) {
    return this.players.find(p => p.id === id);
  }

  getPlayerByIndex(index) {
    const total = this.players.length;
    return this.players[(index + total) % total];
  }

  getPlayerHand(playerID) {
    const player = this.getPlayerById(playerID);
    if (!player) throw new Error('Jugador no encontrado para getPlayerHand');
    return player.hand;
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

  getTopDiscard() {
    return this.discardPile[this.discardPile.length - 1] || null;
  }

  // ======================
  // Setters / operaciones simples
  // ======================

  setPhase(phase) {
    this.phase = phase;
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

  setTurnDeadline(timestamp) {
    this.turnDeadline = timestamp;
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

  // ======================
  // Operaciones de cartas
  // ======================

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

  // ======================
  // Bot / conectividad
  // ======================

  setPlayerConnected(playerId, connected) {
    const player = this.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');
    player.connected = connected;
  }

  setPlayerIsBot(playerId, isBot) {
    const player = this.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');
    player.isBot = isBot;
  }

  setPlayerSaidUno(playerId, saidUno) {
    const player = this.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');
    player.saidUno = saidUno;
  }
}

module.exports = GameState;