// src/core/start-game/Partida.js

class Partida {
  constructor(config = {}) {
    this.id_partida = config.id_partida ?? null;
    this.num_cartas_inicio = config.num_cartas_inicio ?? 7;
    this._modo_cartas_especiales = config._modo_cartas_especiales ?? false;
    this._modo_roles = config._modo_roles ?? false;
    this.sonido = config.sonido ?? true;
    this.musica = config.musica ?? true;
    this.vibracion = config.vibracion ?? true;
    this.estado = config.estado ?? "esperando jugadores"; // lobby
    this.timeout_turno = config.timeout_turno ?? 30;
    this.max_jugadores = config.max_jugadores ?? 4;
    this.partida_publica = config.partida_publica ?? true;
  }

  // ================= GETTERS =================
  getIdPartida() { return this.id_partida; }
  getNumCartasInicio() { return this.num_cartas_inicio; }
  getModoCartasEspeciales() { return this._modo_cartas_especiales; }
  getModoRoles() { return this._modo_roles; }
  getSonido() { return this.sonido; }
  getMusica() { return this.musica; }
  getVibracion() { return this.vibracion; }
  getEstado() { return this.estado; }
  getTimeoutTurno() { return this.timeout_turno; }
  getMaxJugadores() { return this.max_jugadores; }
  getPartidaPublica() { return this.partida_publica; }

  // ================= SETTERS =================
  setIdPartida(valor) { this.id_partida = valor; }
  setNumCartasInicio(valor) { this.num_cartas_inicio = valor; }
  setModoCartasEspeciales(valor) { this._modo_cartas_especiales = valor; }
  setModoRoles(valor) { this._modo_roles = valor; }
  setSonido(valor) { this.sonido = valor; }
  setMusica(valor) { this.musica = valor; }
  setVibracion(valor) { this.vibracion = valor; }
  setEstado_encurso() { this.estado = "en curso"; }
  setEstado_pausado() { this.estado = "pausada"; }
  setEstado_finalizada() { this.estado = "finalizada"; }
  setEstado_esperandojugadores() { this.estado = "esperando jugadores"; }
  setTimeoutTurno(valor) { this.timeout_turno = valor; }
  setMaxJugadores(valor) { this.max_jugadores = valor; }
  setPartidaPublica(tipo) { this.partida_publica = tipo; }
}

module.exports = Partida;