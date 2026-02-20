// src/core/game-engine/game.logic.js
class GameLogic{
    constructor(gameState) {
        this.gameState = gameState;
    }
    // Inicializa la partida
  startGame(deck) {
    const state = this.gameState;
    if (state.status !== 'waiting') {
      throw new Error('La partida ya ha comenzado');
    }
    if(state.players.length < 2) {
      throw new Error('Se necesitan al menos 2 jugadores para iniciar la partida');
    }
    const totalCartasNecesarias = state.players.length * state.numCartasInicio + 1; // cartas para repartir + carta inicial
    if(deck.length < totalCartasNecesarias) {
      throw new Error('No hay suficientes cartas en el deck para iniciar la partida');
    }
    state.setStatus('playing');
    state.currentTurn = 0;
    state.direction = 1;
    state.drawPile = state.shuffleDeck(deck); // crea una copia del array deck
    state.discardPile = [];
    state.players.forEach(j => j.hand = []); // limpia las hands de los jugadores
    state.dealCards();
    const initialCard = state.drawCard();
    state.setInitialCard(initialCard); // coloca la carta inicial en juego
  }
    // Valida jugada (simplificado, reglas reales van aparte) 
  playCard(playerID, card) {
    const state = this.gameState;
    if(state.status !== 'playing') {
      throw new Error('La partida no está en juego');
    }
    if(state.getCurrentPlayer().id !== playerID) {
      throw new Error('No es el turno del jugador');
    }
    state.applyPlayCard('playCard', playerID, card);
    // avanzar turno
    state.nextTurn();
  }

    // Pausa partida
  pauseGame() {
    this.gameState.setStatus('paused') ;
  }
  // Finaliza partida
  endGame() {
    this.gameState.setStatus('finished') ;
  }
}

module.exports = GameLogic;