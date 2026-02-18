// src/core/game-engine/game.state.js

class GameState {
  constructor({ id, players, numCartasInicio, modoCartasEspeciales, modoRoles }) {
    this.id = id; // id de la partida
    this.estado = 'waiting'; // waiting, playing, paused, finished

    this.jugadores = jugadores.map((p, index) => ({
      id: p.id_usuario,
      mano: [],               // cartas en mano
      rol: p.id_rol || null,
      usosRol: p.usos_rol_partida || 0,
      //conectado: true,
      ordenTurno: index         // orden de turno
    }));

    this.turnoActual = 0;
    this.direccion = 1; // 1 = agujas del reloj, -1 = invertida
    this.mazoRobo = [];
    this.mazoDescartes = [];
    this.cartaEnJuego = null;
    this.numCartasInicio = numCartasInicio;
    this.modoCartasEspeciales = modoCartasEspeciales;
    this.modoRoles = modoRoles;
  }

  // Devuelve el jugador que tiene el turno
  getCurrentPlayer() {
    return this.jugadores[this.turnoActual];
  }

  // Avanza al siguiente turno
  nextTurn() {
    const totalPlayers = this.jugadores.length;
    this.turnoActual = (this.turnoActual + this.direccion + totalPlayers) % totalPlayers;
  }

  // Baraja mazo - Hecho con ChatGPT
  /*
  Prompt:
    Dado este GameState:
    class GameState {
    constructor({ id, players, numCartasInicio, modoCartasEspeciales, modoRoles }) {
    this.id = id; // id de la partida
    this.estado = 'waiting'; // waiting, playing, paused, finished

    this.jugadores = jugadores.map((p, index) => ({
      id: p.id_usuario,
      mano: [],               // cartas en mano
      rol: p.id_rol || null,
      usosRol: p.usos_rol_partida || 0,
      //conectado: true,
      ordenTurno: index         // orden de turno
    }));

    this.turnoActual = 0;
    this.direccion = 1; // 1 = agujas del reloj, -1 = invertida
    this.mazoRobo = [];
    this.mazoDescartes = [];
    this.cartaEnJuego = null;
    this.numCartasInicio = numCartasInicio;
    this.modoCartasEspeciales = modoCartasEspeciales;
    this.modoRoles = modoRoles;
  }
    
  Hazme una funcion shuffleDeck(mazo) que baraje el mazo que recibe
  */
  shuffleDeck(mazo) {
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
  }

  // Inicializa la partida
  startGame(mazo) {
    this.estado = 'playing';
    this.shuffleDeck(mazo);
    this.mazoRobo = [...mazo]; // crea una copia del array mazo
    this.mazoDescartes = [];
    this.dealCards();
    this.cartaEnJuego = this.drawCard();
  }

  // Reparte cartas a cada jugador
  dealCards() {
    for (let i = 0; i < this.numCartasInicio; i++) {
      this.jugadores.forEach(jugador => {
        jugador.hand.push(this.drawCard());
      });
    }
  }

  // Saca carta del mazo
  drawCard() {
    return this.drawPile.shift(); // elimina y devuelve la primera carta
  }

  // Valida jugada (simplificado, reglas reales van aparte)
  playCard(idJugador, carta) {
    const player = this.jugadores.find(p => p.id === idJugador);
    if (!player) throw new Error('Jugador no encontrado');
    const cardIndex = player.mano.findIndex(c => c.id === carta.id);
    if (cardIndex === -1) throw new Error('Carta no en mano');

    // quitar carta de la mano
    player.mano.splice(cardIndex, 1);
    // añadir a pila de descartes
    this.mazoDescartes.push(carta);
    // actualizar carta actual
    this.cartaEnJuego = carta;

    // avanzar turno
    this.nextTurn();
  }

  // Pausa partida
  pauseGame() {
    this.status = 'paused';
  }

  // Finaliza partida
  endGame() {
    this.status = 'finished';
  }
}

module.exports = GameState;