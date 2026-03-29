const gameService = require('./gameService');

// ================= CREAR =================
async function crearPartida(req, res) {
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
      privada: req.body.privada
    };

    const partida = await gameService.crearPartida(id_creador, config);

    res.status(201).json({
      gameId: partida.id_partida,
      codigo: partida.codigo || null
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ================= JOIN =================
async function unirsePartida(req, res) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    await gameService.unirsePartida(gameId, username);

    res.status(200).json({ message: 'Unido correctamente' });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ================= JOIN POR CÓDIGO =================
async function unirsePorCodigo(req, res) {
  try {
    const username = req.user.nombre_usuario;
    const { codigo } = req.body;

    await gameService.unirsePorCodigo(codigo, username);

    res.status(200).json({ message: 'Unido por código' });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ================= LOBBY =================
async function obtenerPartida(req, res) {
  try {
    const gameId = req.params.gameId;

    const partida = await gameService.obtenerPartida(gameId);

    res.status(200).json(partida);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// ================= STATE (CORE) =================
async function obtenerEstadoPartida(req, res) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const estado = await gameService.obtenerEstadoPartida(gameId, username);

    res.status(200).json(estado);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// ================= END =================
async function finalizarPartida(req, res) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    await gameService.finalizarPartida(gameId, username);

    res.status(200).json({ message: 'Partida finalizada' });

  } catch (error) {
    res.status(403).json({ message: error.message });
  }
}

async function jugarCarta(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const { gameId } = req.params;
    const { cardId } = req.body;

    const result = await gameService.jugarCarta(gameId, username, cardId);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function robarCarta(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const { gameId } = req.params;

    const result = await gameService.robarCarta(gameId, username);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crearPartida,
  unirsePartida,
  unirsePorCodigo,
  obtenerPartida,
  obtenerEstadoPartida,
  finalizarPartida,
  jugarCarta,
  robarCarta
};