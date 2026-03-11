// ================= GAME CONTROLLER =================
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
      vibracion: req.body.vibracion,
      privada: req.body.privada,
      contrasena: req.body.contrasena
    };

    const partida = await gameService.crearPartida(id_creador, config);

    res.status(201).json({
      gameId: partida.gameId,
      max_jugadores: partida.maxJugadores,
      privada: partida.privada
    });
  } catch (error) {
    // Error de datos inválidos
    res.status(400).json({ message: 'Error en los datos enviados' });
  }
}

async function unirsePartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;
    const { contrasena } = req.body;

    const result = await gameService.unirsePartida(gameId, username, contrasena);

    if (!result.success) {
      return res.status(400).json({ message: 'Error al unirse (partida llena o contraseña incorrecta)' });
    }

    res.status(200).json({ message: 'Usuario agregado a la partida' });
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
}

async function empezarPartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await gameService.empezarPartida(gameId, username);

    if (!result.success) {
      return res.status(400).json({ message: 'No se puede iniciar la partida (menos de 2 jugadores)' });
    }

    res.status(200).json({ message: 'Partida iniciada correctamente' });
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
}

async function obtenerPartida(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const partida = await gameService.obtenerPartida(gameId);

    if (!partida) return res.status(404).json({ message: 'Partida no encontrada' });

    res.status(200).json({
      gameId: partida.gameId,
      jugadores: partida.jugadores,
      estado: partida.estado
    });
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
}

async function obtenerEstadoPartida(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const estado = await gameService.obtenerEstadoPartida(gameId, username);

    if (!estado) return res.status(404).json({ message: 'Partida no encontrada' });

    res.status(200).json({
      gameId: estado.gameId,
      turnoActual: estado.turnoActual,
      cartasEnMano: estado.cartasEnMano,
      pila: estado.pila,
      direccion: estado.direccion,
      estado: estado.estado
    });
  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
}

module.exports = {
  crearPartida,
  unirsePartida,
  empezarPartida,
  obtenerPartida,
  obtenerEstadoPartida
};