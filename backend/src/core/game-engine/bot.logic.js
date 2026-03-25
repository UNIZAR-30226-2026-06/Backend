class BotLogic {
  constructor(state, cardRules, turnManager) {
    this.state = state;
    this.cardRules = cardRules;
    this.turnManager = turnManager;
  }

  decideMove(playerID) {
    const player = this.state.getPlayerById(playerID);
    if (!player) throw new Error('Jugador no encontrado para el bot');

    const hand = player.hand;

    let playable = hand.filter(card => this.cardRules.canPlay(card));

    if (playable.length === 0) {
      return { type: 'draw' };
    }

    const nextPlayer = this.turnManager.getNextPlayer();
    const nextHand = this.state.getPlayerHand(nextPlayer.id);

    if (nextHand.length === 1) {
      const attackCard = playable.find(c => ['draw2','draw4','skip','reverse'].includes(c.value));
      if (attackCard) return this.buildPlayDecision(attackCard, hand);
    }

    if (hand.length > 4) {
      const filtered = playable.filter(c => !['draw2','draw4'].includes(c.value));
      if (filtered.length > 0) playable = filtered;
    }

    const bestCard = this.selectBestCard(playable);
    return this.buildPlayDecision(bestCard, hand);
  }

  getNextPlayer() {
    const totalPlayers = this.state.getPlayersCount();
    const currentIndex = this.state.getCurrentTurnIndex();
    const dir = this.state.getDirection();
    const nextIndex = (currentIndex + dir + totalPlayers) % totalPlayers;
    return this.state.getPlayerByIndex(nextIndex);
  }

  selectBestCard(playable) {
    const priority = { 'draw4': 4, 'draw2': 3, 'skip': 2, 'reverse': 1 };
    return playable.sort((a,b) => (priority[b.value]||0) - (priority[a.value]||0))[0];
  }

  buildPlayDecision(card, hand) {
    if (card.color === 'black') {
      return {
        type: 'play',
        card,
        chosenColor: this.chooseColor(hand)
      };
    }
    return { type: 'play', card };
  }

  chooseColor(hand) {
    const counts = {};
    hand.forEach(c => {
      if (c.color !== 'black') counts[c.color] = (counts[c.color] || 0) + 1;
    });
    return Object.keys(counts).sort((a,b) => counts[b]-counts[a])[0];
  }
}

module.exports = BotLogic;