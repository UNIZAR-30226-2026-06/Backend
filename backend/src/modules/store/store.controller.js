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