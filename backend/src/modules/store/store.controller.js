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
    const avatarID = req.body.id;
    const avatar = await storeService.obtenerAvatarporId(avatarID);
    res.json(avatar);
  } catch (err) {
    next(err);
  }
};

exports.obtenerEstiloID = async (req, res, next) => {
  try {
    const estiloID = req.body.id;
    const estilo = await storeService.obtenerEstiloporId(estiloID);
    res.json(estilo);
  } catch (err) {
    next(err);
  }
};