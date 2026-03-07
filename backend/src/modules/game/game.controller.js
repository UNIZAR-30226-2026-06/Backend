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

module.exports = {
  crearPartida
};