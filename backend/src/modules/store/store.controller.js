const storeService = require('./storeService');

exports.obtenerAvataresTienda = async (req, res, next) => {
  try {
    const avatares = await storeService.obtenerAvataresTienda();
    res.json(avatares);
  } catch (err) {
    next(err);
  }
};

exports.obtenerEstilosTienda = async (req, res, next) => {
  try {
    const estilos = await storeService.obtenerEstilosTienda();
    res.json(estilos);
  } catch (err) {
    next(err);
  }
};

exports.obtenerAvatarID = async (req, res, next) => {
  try {
    const avatar = await storeService.obtenerAvatarporId(req.body.id);
    res.json(avatar);
  } catch (err) {
    next(err);
  }
};

exports.obtenerEstiloID = async (req, res, next) => {
  try {
    const estilo = await storeService.obtenerEstiloporId(req.body.id);
    res.json(estilo);
  } catch (err) {
    next(err);
  }
};