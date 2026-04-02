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

    return !currentCard || card.color === currentCard.color || card.value === currentCard.value || card.color === 'black';
  }

  applyEffect(card, playerID) {
    switch (card.value) {
      case 'reverse':
        this.state.reverseDirection();
        break;
      case 'skip':
        this.state.skipNextTurn();
        break;
      case 'draw2':
        this.applyDraw(playerID, 2);
        this.state.skipNextTurn();
        break;
      case 'draw4':
        this.applyDraw(playerID, 4);
        this.state.skipNextTurn();
        break;
      case 'extraTurn':
        this.state.stayTurn();
        break;
      case 'playOdd':
      case 'playEven':
        const nextPlayer = this.state.getNextPlayer();
        this.state.setFilter(
          nextPlayer.id,
          card.value === 'playOdd'
            ? val => parseInt(val) % 2 === 1
            : val => parseInt(val) % 2 === 0
        );
        break;
      default:
        break;
    }
  }

  applyDraw(playerID, count) {
    const targetPlayer = this.state.getNextPlayer();
    for (let i = 0; i < count; i++) {
      const card = this.gameLogic.drawCard();
      this.state.addCardToPlayer(targetPlayer.id, card);
    }
  }
}

module.exports = CardRules;
