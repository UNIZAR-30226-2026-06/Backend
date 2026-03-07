class DeckFactory {

  static COLORS = ["blue", "red", "green", "yellow"];
  static NUMBERS = ["0","1","2","3","4","5","6","7","8","9"];
  static SPECIALS = ["+2", "reverse", "+2R", "skip", "extraTurn", "playOdd", "playEven"];
  static NUM_CARTAS_CADA_TIPO = 4;

  static createDeck(config) {
    let deck = [];

    deck = deck.concat(this.createBaseCards());

    if (config.specialCardsMode) {
      deck = deck.concat(this.createSpecialCards());
    }

    if (config.rolesMode) {
      deck = deck.concat(this.createRoleCards());
    }

    // Mezclar antes de devolver
    return this.shuffle(deck);
  }

  static createBaseCards() {
    const deck = [];

    this.COLORS.forEach(color => {
      this.NUMBERS.forEach(number => {
        for (let i = 0; i < this.NUM_CARTAS_CADA_TIPO; i++) {
          deck.push({
            id: `${color}-${number}-${i}`, // ID único
            value: number,
            color,
            type: "normal"
          });
        }
      });
    });

    return deck;
  }

  static createSpecialCards() {
    const deck = [];

    this.COLORS.forEach(color => {
      this.SPECIALS.forEach(special => {
        for (let i = 0; i < this.NUM_CARTAS_CADA_TIPO; i++) {
          deck.push({
            id: `${color}-${special}-${i}`, // ID único
            value: special,
            color,
            type: "special"
          });
        }
      });
    });

    return deck;
  }

  static createRoleCards() {
    // Por ahora vacío; implementar según roles de juego
    return [];
  }

  static shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
}

module.exports = DeckFactory;