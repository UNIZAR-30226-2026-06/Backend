class CardRules {
  constructor(state, gameLogic) {
    this.state = state;
    this.gameLogic = gameLogic;
  }

  canPlay(card) {
    const currentCard = this.state.getTopDiscard();
    const currentPlayer = this.state.getCurrentPlayer();

    const filterFn = this.state.getFilter(currentPlayer.id);
    if (filterFn && !filterFn(card.value)) return false;

    const currentColor = this.state.getCardColor(currentCard);
    const cardColor = this.state.getCardColor(card);

    return !currentCard || cardColor === 'black' || cardColor === currentColor || card.value === currentCard.value;
  }

  applyEffect(card, playerID) {
    switch (card.value) {
      case '+2':
      case 'draw2':
      case '+2R':
        this.state.reverseDirection();
        this.applyDraw(playerID, 2);
        this.state.skipNextTurn();
        break;
      case '+4':
      case 'draw4':
        this.state.reverseDirection();
        this.applyDraw(playerID, 4);
        this.state.skipNextTurn();
        break;
      case '+1':
        this.applyDrawToAllPlayers(1);
        break;
      case 'reverse':
        this.state.reverseDirection();
        break;
      case 'skip':
        this.state.skipNextTurn();
        break;
      case 'extraTurn':
        this.state.stayTurn();
        break;
      case 'swapHands':
        this.gameLogic.swapHands();
        break;
      case 'discardHandRedraw':
        this.gameLogic.discardHandAndRedraw(playerID);
        break;
      case 'restartGame':
        this.gameLogic.restartGame();
        return false;
      case 'specialOnly':
        this.setSpecialOnlyFilter();
        break;
      case 'playOdd':
      case 'playEven':
        const nextPlayer = this.state.getNextPlayer();
        this.state.setFilter(
          nextPlayer.id,
          card.value === 'playOdd'
            ? val => parseInt(val, 10) % 2 === 1
            : val => parseInt(val, 10) % 2 === 0,
          1
        );
        break;
      default:
        break;
    }

    return true;
  }

  applyDraw(playerID, count) {
    const targetPlayer = this.state.getNextPlayer();
    for (let i = 0; i < count; i++) {
      const card = this.gameLogic.drawCard();
      this.state.addCardToPlayer(targetPlayer.id, card);
    }
  }

  applyDrawToAllPlayers(count) {
    for (const player of this.state.players) {
      for (let i = 0; i < count; i++) {
        const card = this.gameLogic.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }
  }

  setSpecialOnlyFilter() {
    const nextPlayer = this.state.getNextPlayer();
    this.state.setFilter(
      nextPlayer.id,
      value => !/^\d+$/.test(String(value)),
      1
    );
  }
}

module.exports = CardRules;
