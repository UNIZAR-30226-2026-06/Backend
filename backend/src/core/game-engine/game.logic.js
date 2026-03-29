const DeckFactory = require('./deck.factory');
const TurnManager = require('./turn.manager');
const CardRules = require('./card.rules');
const BotLogic = require('./bot.logic');

const TURN_DURATION_MS = 30000;

class GameLogic {
  constructor(gameState) {
    this.state = gameState;
    this.turnManager = new TurnManager(this.state);
    this.cardRules = new CardRules(this.state, this.turnManager, this);
    this.botLogic = new BotLogic(this.state, this.cardRules, this.turnManager);
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

  startGame() {
    if (this.state.phase !== 'waiting')
      throw new Error('La partida ya ha comenzado');

    if (this.state.getPlayersCount() < 2)
      throw new Error('Se necesitan al menos 2 jugadores');

    const deck = this.shuffle(
      DeckFactory.createDeck({
        specialCardsMode: this.state.specialCardsMode,
        rolesMode: this.state.rolesMode
      })
    );

    this.state.setDrawPile(deck);
    this.state.setDiscardPile([]);

    this.state.setPhase('playing');
    this.state.resetTurn();
    this.state.setDirection(1);
    this.state.clearHands();

    for (let i = 0; i < this.state.numCardsIni; i++) {
      for (const player of this.state.players) {
        const card = this.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }

    const initialCard = this.drawCard();
    this.state.setCurrentCard = initialCard;
    this.state.addToDiscardPile(initialCard);

    // 🔥 CRÍTICO
    this.state.setNewTurnDeadline(TURN_DURATION_MS);
  }

  playCard(playerId, card) {
    if (this.state.phase !== 'playing')
      throw new Error('La partida no está en juego');

    const currentPlayer = this.turnManager.getCurrentPlayer();

    if (currentPlayer.id !== playerId)
      throw new Error('No es el turno');

    if (!this.cardRules.canPlay(card))
      throw new Error('Carta no válida');

    this.state.removeCardFromPlayer(playerId, card);
    this.state.setCurrentCard = card;
    this.state.addToDiscardPile(card);

    this.cardRules.applyEffect(card, playerId);

    this.turnManager.next();

    // 🔥 CRÍTICO
    this.state.setNewTurnDeadline(TURN_DURATION_MS);
  }
}

module.exports = GameLogic;
