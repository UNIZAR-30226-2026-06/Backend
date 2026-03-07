// src/core/game-engine/card.rules.js
class CardRules {
    constructor(state, turnManager, gameLogic) {
        this.state = state;
        this.turnManager = turnManager;
        this.gameLogic = gameLogic;
    }

    canPlay(card) {
        const currentCard = this.state.getCurrentCard();
        const currentPlayer = this.state.getCurrentPlayer();

        // filtrar si hay restricciones temporales
        const filterFn = this.turnManager.getFilter(currentPlayer.id);

        if (filterFn && !filterFn(card.value)) return false;

        return !currentCard || card.color === currentCard.color || card.value === currentCard.value || card.color === 'black';
    }

    applyEffect(card, playerID) {
        switch (card.value) {
            case 'reverse':
                this.turnManager.reverse();
                break;
            case 'skip':
                this.turnManager.skip();
                break;
            case 'draw2':
                this.applyDraw(playerID, 2);
                this.turnManager.skip();
                break;
            case 'draw4':
                this.applyDraw(playerID, 4);
                this.turnManager.skip();
                break;
            case 'extraTurn':
                this.turnManager.stay();
                break;
            case 'playOdd':
                this.turnManager.setFilter(playerID, cardValue => parseInt(cardValue) % 2 === 1);
                break;
            case 'playEven':
                this.turnManager.setFilter(playerID, cardValue => parseInt(cardValue) % 2 === 0);
                break;
            default:
                break;
        }
    }

    applyDraw(playerID, count) {
        const targetPlayer = this.turnManager.getNextPlayer();
        for (let i = 0; i < count; i++) {
            const card = this.gameLogic.drawCard();
            this.state.addCardToPlayer(targetPlayer.id, card);
        }
    }
}

module.exports = CardRules;