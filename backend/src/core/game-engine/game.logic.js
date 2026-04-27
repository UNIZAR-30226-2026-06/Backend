// src/core/game-engine/game.logic.js
const DeckFactory = require('./deck.factory');
const CardRules = require('./card.rules');
const BotLogic = require('./bot.logic');

const TURN_DURATION_MS = 30000;

class GameLogic {
  constructor(gameState) {
    this.state = gameState;
    this.cardRules = new CardRules(this.state, this);
    this.botLogic = new BotLogic(this.state, this.cardRules);
  }

  initializeNewGame() {
    const deck = this.shuffle(
      DeckFactory.createDeck({
        specialCardsMode: this.state.specialCardsMode,
        rolesMode: this.state.rolesMode
      })
    );

    this.state.setDrawPile(deck);
    this.state.setDiscardPile([]);
    this.state.setCurrentCard(null);
    this.state.setPhase('playing');
    this.state.resetTurn();
    this.state.setDirection(1);
    this.state.clearHands();
    this.state.clearFilters();
    this.state.pendingDraw = 0;
    this.state.skipNext = false;
    this.state.turnDeadline = null;
    this.state.pausedAt = null;
    this.state.resumeVotes = [];
    this.state.roleBlock = null;

    for (let i = 0; i < this.state.numCardsIni; i++) {
      for (const player of this.state.players) {
        const card = this.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }

    const initialCard = this.drawCard();
    this.state.setCurrentCard(initialCard);
    this.state.addToDiscardPile(initialCard);
    this.state.setNewTurnDeadline(TURN_DURATION_MS);
  }

  // ======================
  // BARAJAR
  // ======================
  shuffle(deck) {
    const copy = [...deck];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ======================
  // RECICLAR SI NO HAY CARTAS
  // ======================
  recycleIfNeeded() {
    if (this.state.drawPile.length > 0) return;
    if (this.state.discardPile.length <= 1) throw new Error('No quedan cartas para robar');

    const currentCard = this.state.removeTopDiscard();
    const newPile = this.shuffle(this.state.discardPile);

    this.state.setDrawPile(newPile);
    this.state.setDiscardPile([currentCard]);
  }

  // ======================
  // ROBAR CARTA
  // ======================
  drawCard() {
    this.recycleIfNeeded();
    return this.state.drawFromPile();
  }

  // ======================
  // INICIAR PARTIDA
  // ======================
  startGame() {
    if (this.state.phase !== 'waiting') throw new Error('La partida ya ha comenzado');
    if (this.state.getPlayersCount() < 2) throw new Error('Se necesitan al menos 2 jugadores');
    this.initializeNewGame();
  }

  restartGame() {
    this.initializeNewGame();
  }

  swapHands() {
    this.state.rotateHands(this.state.direction);
  }

  discardHandAndRedraw(playerId) {
    const player = this.state.getPlayerById(playerId);
    if (!player) throw new Error('Jugador no encontrado');

    const cardsToDiscard = [...player.hand];
    player.hand = [];
    cardsToDiscard.forEach(card => this.state.addToDiscardPile(card));

    for (let i = 0; i < cardsToDiscard.length; i++) {
      const card = this.drawCard();
      this.state.addCardToPlayer(playerId, card);
    }
  }

  drawCardsForAllPlayers(count) {
    for (const player of this.state.players) {
      for (let i = 0; i < count; i++) {
        const card = this.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }
  }

  // ======================
  // JUGAR CARTA
  // ======================
  playCard(playerId, card) {
    if (this.state.phase !== 'playing') throw new Error('La partida no está en juego');

    const currentPlayer = this.state.getCurrentPlayer();
    if (currentPlayer.id !== playerId) throw new Error('No es el turno');
    if (!this.cardRules.canPlay(card)) throw new Error('Carta no válida');

    const playerHand = this.state.getPlayerHand(playerId);
    const remainingHand = playerHand.filter(c => c.id !== card.id);
    const resolvedCard = { ...card };

    if (resolvedCard.color === 'black') {
      const fallbackColor = this.botLogic.chooseColor(remainingHand.length > 0 ? remainingHand : playerHand) || 'red';
      resolvedCard.chosenColor = resolvedCard.chosenColor || resolvedCard.selectedColor || resolvedCard.effectiveColor || fallbackColor;
    }

    this.state.removeCardFromPlayer(playerId, card);
    this.state.setCurrentCard(resolvedCard);
    this.state.addToDiscardPile(resolvedCard);

    const shouldAdvanceTurn = this.cardRules.applyEffect(resolvedCard, playerId);

    if (shouldAdvanceTurn === false) {
      return;
    }

    this.state.advanceTurn();
    this.state.setNewTurnDeadline(TURN_DURATION_MS);
  }

  // ======================
  // RESOLVER TIMEOUT AUTOMÁTICO
  // ======================
  resolveTimeoutIfNeeded() {
    if (this.state.turnDeadline && Date.now() > this.state.turnDeadline) {
      const currentPlayer = this.state.getCurrentPlayer();
      const card = this.drawCard();
      this.state.addCardToPlayer(currentPlayer.id, card);
      this.state.advanceTurn();
      this.state.setNewTurnDeadline(TURN_DURATION_MS);
    }
  }
}

module.exports = GameLogic;
