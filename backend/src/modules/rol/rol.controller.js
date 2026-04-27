const rolService = require('./rolService');

async function obtenerMiRol(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await rolService.getMiRol(gameId, username);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function obtenerMisUsos(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await rolService.getMisUsos(gameId, username);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function usarRol(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const gameId = req.params.gameId;

    const result = await rolService.usarRol(gameId, username, req.body || {});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerMiRol,
  obtenerMisUsos,
  usarRol
};