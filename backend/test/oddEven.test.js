// test/oddEven.test.js
const GameState = require("../src/core/game-engine/game.state");
const GameLogic = require("../src/core/game-engine/game.logic");

describe("Odd / Even duran solo un turno", () => {

  test("playOdd solo afecta al siguiente jugador", () => {
    const players = [
      { userId: "A" },
      { userId: "B" }
    ];

    const state = new GameState({
      id: "test",
      players,
      numCardsIni: 1,
      specialCardsMode: true,
      rolesMode: false
    });

    const logic = new GameLogic(state);

    // Inicialización manual determinista
    const playOdd = { id: 1, color: "blue", value: "playOdd" };
    const oddCard = { id: 2, color: "red", value: "3" };
    const evenCard = { id: 3, color: "green", value: "4" };

    state.players[0].hand = [playOdd];
    state.players[1].hand = [oddCard, evenCard];

    state.setCurrentTurnIndex(0); // turno del jugador A
    state.setCurrentCard({ id: 99, color: "blue", value: "7" });

    logic.playCard("A", playOdd);

    // Ahora es turno del siguiente jugador
    const canPlayOdd = logic.cardRules.canPlay(oddCard);
    const canPlayEven = logic.cardRules.canPlay(evenCard);

    expect(canPlayOdd).toBe(true);
    expect(canPlayEven).toBe(false);
  });


  test("playEven solo afecta al siguiente jugador", () => {
    const players = [
      { userId: "A" },
      { userId: "B" }
    ];

    const state = new GameState({
      id: "test",
      players,
      numCardsIni: 1,
      specialCardsMode: true,
      rolesMode: false
    });

    const logic = new GameLogic(state);

    // Inicialización manual determinista
    const playEven = { id: 10, color: "blue", value: "playEven" };
    const oddCard = { id: 11, color: "red", value: "3" };
    const evenCard = { id: 12, color: "green", value: "4" };

    state.players[0].hand = [playEven];
    state.players[1].hand = [oddCard, evenCard];

    state.setCurrentTurnIndex(0); // turno del jugador A
    state.setCurrentCard({ id: 99, color: "blue", value: "7" });

    logic.playCard("A", playEven);

    // Ahora es turno del siguiente jugador
    const canPlayOdd = logic.cardRules.canPlay(oddCard);
    const canPlayEven = logic.cardRules.canPlay(evenCard);

    expect(canPlayOdd).toBe(false);
    expect(canPlayEven).toBe(true);
  });

});