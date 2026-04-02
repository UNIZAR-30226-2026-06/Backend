class GameState {
  constructor({ id, players, numCardsIni, specialCardsMode, rolesMode }) {
    this.id = id;
    this.phase = 'waiting';
    this.currentCard = null;

    this.players = players.map((p) => ({
      id: p.userId || p.id,
      hand: [],
      rol: p.rol || null,
      rolUses: p.rolUses || 0,
      connected: p.connected ?? true,
      isBot: p.isBot ?? false,
      saidUno: p.saidUno ?? false
    }));

    this.currentTurn = 0;
    this.direction = 1;

    this.turnDeadline = null;

    this.drawPile = [];
    this.discardPile = [];

    this.pendingDraw = 0;
    this.skipNext = false;

    this.numCardsIni = numCardsIni;
    this.specialCardsMode = specialCardsMode;
    this.rolesMode = rolesMode;

    this.createdAt = Date.now();

    this.filters = {};
  }

  // ======================
  // TURNOS
  // ======================

  setNewTurnDeadline(durationMs) {
    this.turnDeadline = Date.now() + durationMs;
  }

  isTurnExpired() {
    return this.turnDeadline && Date.now() >= this.turnDeadline;
  }

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
    if (!player) throw new Error('Jugador no encontrado');
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

  getCurrentCard() {
    return this.currentCard;
  }

  // ======================
  // SETTERS Y TURN LOGIC
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

  advanceTurn() {
    this.currentTurn = (this.currentTurn + this.direction + this.players.length) % this.players.length;
  }

  getNextPlayer() {
    return this.getPlayerByIndex((this.currentTurn + this.direction + this.players.length) % this.players.length);
  }

  reverseDirection() {
    this.direction *= -1;
  }

  skipNextTurn() {
    this.advanceTurn();
  }

  stayTurn() {
    // no cambia currentTurn
  }

  setFilter(playerId, fn) {
    this.filters[playerId] = fn;
  }

  getFilter(playerId) {
    return this.filters[playerId];
  }

  // ======================
  // MANEJO DE CARTAS
  // ======================

  setDrawPile(pile) {
    this.drawPile = pile;
  }

  setDiscardPile(pile) {
    this.discardPile = pile;
  }

  setCurrentCard(card) {
    this.currentCard = card;
  }

  clearHands() {
    this.players.forEach(p => p.hand = []);
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

  // ======================
  // CONECTIVIDAD
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
