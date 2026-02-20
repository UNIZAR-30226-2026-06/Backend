// Solo debe ser usado por GameLogic, no debe tener lógica de juego, solo status y funciones auxiliares para modificarlo

// src/core/game-engine/game.state.js

class GameState {
  constructor({ id, players, numCartasInicio, modoCartasEspeciales, modoRoles }) {
    this.id = id; // id de la partida
    this.status = 'waiting'; // waiting, playing, paused, finished

    this.players = players.map((p, index) => ({
      id: p.id_usuario,
      hand: [],               // cartas en mano
      rol: p.id_rol || null,
      rolUses: p.usos_rol_partida || 0,
      //conectado: true,
      turnOrder: index         // orden de turno
    }));

    this.currentTurn = 0;
    this.direction = 1; // 1 = agujas del reloj, -1 = invertida
    this.drawPile = [];
    this.discardPile = [];
    this.currentCard = null;
    this.numCartasInicio = numCartasInicio;
    this.modoCartasEspeciales = modoCartasEspeciales;
    this.modoRoles = modoRoles;
  }

  // Devuelve el jugador que tiene el turno
  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  // Avanza al siguiente turno
  nextTurn() {
    const totalPlayers = this.players.length;
    this.currentTurn = (this.currentTurn + this.direction + totalPlayers) % totalPlayers;
  }

  // Baraja mazo - Hecho con ChatGPT
  /*
  Prompt:
    Dado este GameState:
    class GameState {
    constructor({ id, players, numCartasInicio, modoCartasEspeciales, modoRoles }) {
    this.id = id; // id de la partida
    this.status = 'waiting'; // waiting, playing, paused, finished

    this.players = players.map((p, index) => ({
      id: p.id_usuario,
      hand: [],               // cartas en hand
      rol: p.id_rol || null,
      rolUses: p.usos_rol_partida || 0,
      //conectado: true,
      turnOrder: index         // orden de turno
    }));

    this.currentTurn = 0;
    this.direction = 1; // 1 = agujas del reloj, -1 = invertida
    this.drawPile = [];
    this.discardPile = [];
    this.currentCard = null;
    this.numCartasInicio = numCartasInicio;
    this.modoCartasEspeciales = modoCartasEspeciales;
    this.modoRoles = modoRoles;
  }
    
  Hazme una funcion shuffleDeck(mazo) que baraje el mazo que recibe
  */
  shuffleDeck(mazo) {
    const copia = [...mazo]; // crea una copia del array mazo
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
  initializeGame(mazo) {
    if (this.status !== 'waiting') {
      throw new Error('La partida ya ha comenzado');
    }
    if(this.players.length < 2) {
      throw new Error('Se necesitan al menos 2 players para iniciar la partida');
    }
    if(mazo.length < this.players.length * this.numCartasInicio + 1) {
      throw new Error('No hay suficientes cartas en el mazo para iniciar la partida');
    }
    this.setStatus('playing');
    this.currentTurn = 0;
    this.direction = 1;
    this.drawPile = this.shuffleDeck(mazo); // crea una copia del array mazo
    this.discardPile = [];
    this.players.forEach(j => j.hand = []);
    this.dealCards();
    const cartaInicial = this.drawCard();
    this.setInitialCard(cartaInicial);
  }

  //Carta Inicial
  setInitialCard(carta) {
    this.currentCard = carta;
    this.#addToDiscardPile(carta);
  }

  // Reparte cartas a cada jugador
  dealCards() {
    for (let i = 0; i < this.numCartasInicio; i++) {
      this.players.forEach(jugador => {
        jugador.hand.push(this.drawCard());
      });
    }
  }
  //Recicla la pila de descartes al mazo de robo, dejando la carta actual como único descarte 
  recycleDiscardPile(){
    if(this.discardPile.length <= 1) {
      return; // No hay suficientes cartas para reciclar
    }
    const cartaActual = this.discardPile.pop(); // Saca la carta actual para no reciclarla
    this.drawPile = this.shuffleDeck(this.discardPile); // Baraja los descartes y los convierte en el nuevo mazo de robo
    this.discardPile = [cartaActual]; // Deja la carta actual como el único descarte

  }
  // Saca carta del mazo
  drawCard() {
    if(this.drawPile.length === 0) {
      this.recycleDiscardPile();
    }
    if(this.drawPile.length === 0) {
      throw new Error('No quedan cartas para robar');
    }
    return this.drawPile.shift(); 
  }
  // Cambia el status de la partida
  setStatus(nuevostatus) {
    this.status = nuevostatus;
  }
  // Añade una carta a la hand de un jugador (metodo privado solo para GameLogic)
  #addCardToPlayer(idJugador, carta) {
    const player = this.players.find(p => p.id === idJugador);
    if (!player) throw new Error('Jugador no encontrado');
    player.hand.push(carta);
  }
  // Quita una carta de la hand de un jugador (metodo privado solo para GameLogic)
  #removeCardFromPlayer(idJugador, carta) {
    const player = this.players.find(p => p.id === idJugador);
    if (!player) throw new Error('Jugador no encontrado');
    const cardIndex = player.hand.findIndex(c => c.id === carta.id);
    if (cardIndex === -1) throw new Error('Carta no en hand');
    player.hand.splice(cardIndex, 1);
  }
  // Añade una carta a la pila de descartes (metodo privado solo para GameLogic)
  #addToDiscardPile(carta) {
    this.discardPile.push(carta);
  }
  // Aplica una jugada al status (metodo privado solo para GameLogic)
  #applyPlayCard(idJugador, carta) {
    this.currentCard = carta;
    this.discardPile.push(carta);
  }
  // Método público para que GameLogic aplique jugadas al status sin exponer métodos privados ya comentados e implementados
  applyPlayCard(action, ...args) {
    switch(action) {
      case 'playCard':
        this.#applyPlayCard(...args);
        break;
      case 'addCard':
        this.#addCardToPlayer(...args);
        break;
      case 'removeCard':
        this.#removeCardFromPlayer(...args);
        break;
      case 'addToDiscard':
        this.#addToDiscardPile(...args);
        break;
      default:
        throw new Error('Acción no permitida');
    }
  }


}

module.exports = GameState;