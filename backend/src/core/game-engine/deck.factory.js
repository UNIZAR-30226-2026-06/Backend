class DeckFactory {

  static COLORS = ["blue", "red", "green", "yellow"];
  static NUMBERS = ["0","1","2","3","4","5","6","7","8","9"];
  static SPECIALS = ["+2", "reverse", "+2R", "skip", "extraTurn", "playOdd", "playEven"];

  static createDeck(config) {
    let deck = [];

    deck = deck.concat(this.createBaseCards());

    if (config.specialCardsMode) {
      deck = deck.concat(this.createSpecialCards());
    }

    if (config.rolesMode) {
      deck = deck.concat(this.createRoleCards());
    }

    return deck;
  }

  static createBaseCards() {
    const deck = [];

    this.COLORS.forEach(color => {
      this.NUMBERS.forEach(number => {
        deck.push({
          id: `${color}-${number}`,
          value: number,
          color,
          type: "normal"
        });
      });
    });

    return deck;
  }

  static createSpecialCards() {
    const deck = [];

    this.COLORS.forEach(color => {
      this.SPECIALS.forEach(special => {
        deck.push({
          id: `${color}-${special}`,
          value: special,
          color,
          type: "normal"
        });
      });
    });

    return deck;
  }

  static createRoleCards() {
    // De momento vacío si no están definidas
    return [];
  }
}

module.exports = DeckFactory;