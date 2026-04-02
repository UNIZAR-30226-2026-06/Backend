// src/modules/game/game.controller.js
const gameService = require('./gameService');

// ==========================
// CREAR PARTIDA
// =========================
async function crearPartida(req, res, next) {
  try {
    const id_creador = req.user.nombre_usuario;

    // Validación y saneamiento de inputs
    const config = {
      numCartasInicio: Number(req.body.numCartasInicio) || 7,
      maxJugadores: Number(req.body.maxJugadores) || 4,
      modoCartasEspeciales: !!req.body.modoCartasEspeciales,
      modoRoles: !!req.body.modoRoles,
      timeoutTurno: Number(req.body.timeoutTurno) || 30,
      sonido: req.body.sonido ?? true,
      musica: req.body.musica ?? true,
      vibracion: req.body.vibracion ?? true,
      privada: !!req.body.privada
    };

    const partida = await gameService.crearPartida(id_creador, config);

    res.status(201).json({
      gameId: partida.id_partida,
      codigo: partida.codigo || null
    });

  } catch (err) {
    next(err);
  }
}

// ==========================
// UNIRSE A PARTIDA
// =========================
async function unirsePartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    await gameService.unirsePartida(gameId, username);

    res.status(200).json({ message: 'Unido correctamente' });
  } catch (err) {
    next(err);
  }
}

// ==========================
// UNIRSE POR CÓDIGO
// =========================
async function unirsePorCodigo(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const { codigo } = req.body;

    await gameService.unirsePorCodigo(codigo, username);

    res.status(200).json({ message: 'Unido por código' });
  } catch (err) {
    next(err);
  }
}

// ==========================
// OBTENER INFO DE LOBBY
// =========================
async function obtenerPartida(req, res, next) {
  try {
    const gameId = req.params.gameId;

    const partida = await gameService.obtenerPartida(gameId);

    res.status(200).json(partida);
  } catch (err) {
    next(err);
  }
}

// ==========================
// OBTENER ESTADO DE PARTIDA
// =========================
async function obtenerEstadoPartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const estado = await gameService.obtenerEstadoPartida(gameId, username);

    res.status(200).json(estado);
  } catch (err) {
    next(err);
  }
}

// ==========================
// FINALIZAR PARTIDA
// =========================
async function finalizarPartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    await gameService.finalizarPartida(gameId, username);

    res.status(200).json({ message: 'Partida finalizada' });
  } catch (err) {
    // Si no autorizado
    if (err.message.includes('No autorizado')) {
      res.status(403).json({ message: err.message });
    } else {
      next(err);
    }
  }
}

// =========================
// INICIAR PARTIDA
// =========================
async function iniciarPartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await gameService.iniciarPartida(gameId, username);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ==========================
// JUGAR CARTA
// =========================
async function jugarCarta(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const { gameId } = req.params;
    const { cardId } = req.body;

    const result = await gameService.jugarCarta(gameId, username, cardId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// ==========================
// ROBAR CARTA
// =========================
async function robarCarta(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const { gameId } = req.params;

    const result = await gameService.robarCarta(gameId, username);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crearPartida,
  unirsePartida,
  unirsePorCodigo,
  iniciarPartida,
  obtenerPartida,
  obtenerEstadoPartida,
  finalizarPartida,
  jugarCarta,
  robarCarta
};
