class DeckFactory {
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

    static createBaseCards() {}
    static createSpecialCards() {}
    static createRoleCards() {}

}