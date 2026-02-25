class Partida {
    constructor(_id_partida, _num_cartas_inicio, _modo_cartas_especiales, _modo_roles, _sonido, _musica, _vibracion, _estado, _timeout_turno, _max_jugadores, _partida_publica) {
        this.id_partida=_id_partida;
        this.num_cartas_inicio=_num_cartas_inicio;
        this._modo_cartas_especiales=_modo_cartas_especiales;
        this._modo_roles=_modo_roles;
        this.sonido=_sonido;
        this.musica=_musica;
        this.vibracion=_vibracion;
        this.estado= _estado, 
        this.timeout_turno=_timeout_turno;
        this.max_jugadores=_max_jugadores;
        this.partida_publica=_partida_publica;

    }

    constructor() {
        //partida por defecto
        //this.id_partida=_id_partida;
        this.num_cartas_inicio=7;
        this._modo_cartas_especiales=false;
        this._modo_roles=false;
        this.sonido=true;
        this.musica=true;
        this.vibracion=true;
        this.estado= "esperando jugadores"; 
        this.timeout_turno=30;
        this.max_jugadores=4;
        this.partida_publica=true;

    }
    getIdPartida() {
        return this.id_partida;
    }

    setIdPartida(valor) {
        this.id_partida = valor;
    }

    getNumCartasInicio() {
        return this.num_cartas_inicio;
    }

    setNumCartasInicio(valor) {
        this.num_cartas_inicio = valor;
    }

    getModoCartasEspeciales() {
        return this._modo_cartas_especiales;
    }

    setModoCartasEspeciales(valor) {
        this._modo_cartas_especiales = valor;
    }

    getModoRoles() {
        return this._modo_roles;
    }

    setModoRoles(valor) {
        this._modo_roles = valor;
    }

    getSonido() {
        return this.sonido;
    }

    setSonido(valor) {
        this.sonido = valor;
    }

    getMusica() {
        return this.musica;
    }

    setMusica(valor) {
        this.musica = valor;
    }

    getVibracion() {
        return this.vibracion;
    }

    setVibracion(valor) {
        this.vibracion = valor;
    }

    getEstado() {
        return this.estado;
    }

    setEstado_encurso() {
        this.estado = "en curso";
    }

    setEstado_pausado() {
        this.estado ="pausada";
    }

    setEstado_finalizada() {
        this.estado="finalizada";
    }
    setEstado_esperandojugadores() {
        this.estado="esperando jugadores";
    }

    getTimeoutTurno() {
        return this.timeout_turno;
    }

    setTimeoutTurno(valor) {
        this.timeout_turno = valor;
    }

    getMaxJugadores() {
        return this.max_jugadores;
    }

    setMaxJugadores(valor) {
        this.max_jugadores = valor;
    }

    getPartidaPublica() {
        return this.partida_publica;
    }
    setPartidaPublica(tipo) {
        this.partida_publica=tipo;
    }
}

module.exports = Partida;
