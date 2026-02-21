class CardRules {
    constructor(state, turnManager, gameLogic) {
        this.state = state;
        this.turnManager = turnManager;
        this.gameLogic = gameLogic;
    }
    canplay(card){
        const currentCard = this.state.getCurrentCard();
        return !currentCard || card.color === currentCard.color || card.value === currentCard.value || card.color === 'black';
    }
    applyEffect(card, playerID){
        switch(card.value){
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
            default:
                // no effect
                break;
        }
            }   
    
    applyDraw(playerID, count){
        const players = this.state.players;
        const currentIndex = this.state.currentTurn;
        const dir = this.state.getDirection();
        const total = this.state.getPlayersCount();
        const targetIndex = (currentIndex + dir + total) % total;
        const targetPlayer = players[targetIndex];

        for(let i = 0; i < count; i++){
            const card = this.gameLogic.drawCard();
            this.state.addCardToPlayer(targetPlayer.id, card);
        }
    }
}
module.exports = CardRules;