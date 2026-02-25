class BotLogic {
    constructor(state, cardRules, turnManager) {
        this.state = state;
        this.cardRules = cardRules;
        this.turnManager = turnManager;
    }
    decideMove(playerID) {
        const hand = this.state.getPlayerHand(botID);
        let playable = hand.filter(card => this.cardRules.canplay(card));
        if(playable.length === 0){
            return { type: 'draw' };
        }
        const nextPlayer = this.getNextPlayer();
        const nextPlayerHandSize = this.state.getPlayerHand(nextPlayer.id).length;
        if(nextPlayerHandSize === 1){
            const attackCard = playable.find(card => card.value === 'draw2' || card.value === 'draw4' || card.value === 'skip' || card.value === 'reverse');
            if(attackCard){
                return  this.builPlayDecision(attackCard, hand);
            }

        }
        if(hand.length > 4){
            const filtered = playable.filter(card => card.value !== 'draw2' && card.value !== 'draw4');
            if(filtered.length > 0){
                playable = filtered;
            }
        }
        const bestCard = this.selectBestCard(playable); 
        return { type: 'play', card: bestCard };
    }
    getNextPlayer() {
        const players = this.state.getPlayerCount();
        const currentIndex = this.state.getCurrentTurnIndex();
        const dir = this.state.getDirection();
        const nextIndex = (currentIndex + dir + players) % players;
        return this.state.getPlayersByIndex(nextIndex);
    }
    selectBestCard(playable) {
        const  priority = { 'draw4': 4, 'draw2': 3, 'skip': 2, 'reverse': 1 };
        return playable.sort((a,b) => {
            const aPriority = priority[a.value] || priority['number'];
            const bPriority = priority[b.value] || priority['number'];
            return bPriority - aPriority;
        })[0];
    }
    buildPlayDecision(card, hand) {
        if (card.color === 'black') {
            return {
                action: 'play',
                card,
                chosenColor: this.chooseColor(hand)
            };
        }

        return {
            action: 'play',
            card
        };
    }
        chooseColor(hand) {
        const counts = this.countColors(hand);
        return Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a])[0];
    }

    countColors(hand) {
        const counts = {};

        hand.forEach(card => {
            if (card.color !== 'black') {
                counts[card.color] = (counts[card.color] || 0) + 1;
            }
        });

        return counts;
    }
}

module.exports = BotLogic;

