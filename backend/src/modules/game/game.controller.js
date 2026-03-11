const gameService = require('./gameService');

async function crearPartida(req, res, next) {
  try {

    const id_creador = req.user.nombre_usuario;

    const config = {
      numCartasInicio: req.body.numCartasInicio,
      modoCartasEspeciales: req.body.modoCartasEspeciales,
      modoRoles: req.body.modoRoles,
      maxJugadores: req.body.maxJugadores,
      timeoutTurno: req.body.timeoutTurno,
      sonido: req.body.sonido,
      musica: req.body.musica,
      vibracion: req.body.vibracion
    };

    const partida = await gameService.crearPartida(id_creador, config);

    res.status(201).json(partida);

  } catch (error) {
    next(error);
  }
}


async function unirsePartida(req, res, next) {
  try {

    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await gameService.unirsePartida(gameId, username);

    res.json(result);

  } catch (error) {
    next(error);
  }
}

async function empezarPartida(req, res, next) {
  try {

    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await gameService.empezarPartida(gameId, username);

    res.json(result);

  } catch (error) {
    next(error);
  }
}

async function obtenerPartida(req, res, next) {
  try {

    const gameId = req.params.gameId;

    const partida = await gameService.obtenerPartida(gameId);

    res.json(partida);

  } catch (error) {
    next(error);
  }
}

async function obtenerEstadoPartida(req, res, next) {
  try {

    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const estado = await gameService.obtenerEstadoPartida(gameId, username);

    res.json(estado);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearPartida,
  unirsePartida,
  empezarPartida,
  obtenerPartida,
  obtenerEstadoPartida
};