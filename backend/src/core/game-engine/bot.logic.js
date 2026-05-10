class BotLogic {
  constructor(state, cardRules) {
    this.state = state;
    this.cardRules = cardRules;
  }

  decideMove(playerID) {
    const player = this.state.getPlayerById(playerID);
    if (!player) throw new Error('Jugador no encontrado para el bot');

    const hand = player.hand;
    let playable = hand.filter(card => this.cardRules.canPlay(card));

    if (playable.length === 0) return { type: 'draw' };

    const nextPlayer = this.getNextPlayer();
    const nextHand = this.state.getPlayerHand(nextPlayer.id);
    const attackValues = [
      '+4', '+4R', '+2R', '+2', '+1', 'skip', 'reverse',
      'swapHands', 'discardHandRedraw', 'specialOnly', 'cancelColor'
    ];

    if (nextHand.length === 1) {
      const attackCard = playable.find(c => attackValues.includes(c.value));
      if (attackCard) return this.buildPlayDecision(attackCard, hand, nextHand);
    }

    if (hand.length > 4) {
      const filtered = playable.filter(c => !['+4', '+4R', '+2R'].includes(c.value));
      if (filtered.length > 0) playable = filtered;
    }

    const bestCard = this.selectBestCard(playable);
    return this.buildPlayDecision(bestCard, hand, nextHand);
  }

  getNextPlayer() {
    const totalPlayers = this.state.getPlayersCount();
    const currentIndex = this.state.getCurrentTurnIndex();
    const dir = this.state.getDirection();
    const nextIndex = (currentIndex + dir + totalPlayers) % totalPlayers;
    return this.state.getPlayerByIndex(nextIndex);
  }

  selectBestCard(playable) {
    const priority = {
      '+4': 6, '+4R': 6, '+2R': 4, '+2': 3, '+1': 3,
      'skip': 2, 'reverse': 1, 'swapHands': 2, 'specialOnly': 1,
      'cancelColor': 2, 'changeColor': 1, 'discardHandRedraw': 2,
      'restartGame': 0,
      'addRoleUse': 4,
      'changeRole': 1
    };
    return playable.sort((a, b) => (priority[b.value] || 0) - (priority[a.value] || 0))[0];
  }

  buildPlayDecision(card, hand, nextHand) {
    if (card.color === 'black') {

      const usesChosenColor = !['changeRole', 'addRoleUse', 'restartGame', 'cancelColor'].includes(card.value);
      const decision = {
        type: 'play',
        card,
        ...(usesChosenColor ? { chosenColor: this.chooseColor(hand) } : {})
      };

      if (card.value === 'cancelColor') {
        decision.cancelColor = this.chooseColorToCancel(nextHand, hand);
      }
      return decision;
    }
    return { type: 'play', card };
  }

  chooseColor(hand) {
    const counts = {};
    hand.forEach(c => {
      if (c.color !== 'black') counts[c.color] = (counts[c.color] || 0) + 1;
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  }

  chooseColorToCancel(nextHand, ownHand) {
    const COLORS = ['red', 'green', 'blue', 'yellow'];
    if (Array.isArray(nextHand) && nextHand.length > 0) {
      const counts = {};
      nextHand.forEach(c => {
        if (c.color !== 'black') counts[c.color] = (counts[c.color] || 0) + 1;
      });
      const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      if (sorted[0]) return sorted[0];
    }

    const counts = {};
    COLORS.forEach(c => (counts[c] = 0));
    ownHand.forEach(c => {
      if (counts[c.color] !== undefined) counts[c.color]++;
    });
    return Object.keys(counts).sort((a, b) => counts[a] - counts[b])[0];
  }
}

module.exports = BotLogic;