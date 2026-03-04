// ================= STORE CONTROLLER =================
const storeService = require('./storeService.js');

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

exports.comprarAvatar = async (req, res, next) => {
  try {
    const { id_avatar } = req.body;
    const nombre_usuario = req.user.nombre_usuario;
    const success = await storeService.comprarAvatar(id_avatar, nombre_usuario);
    res.json({ success });
  } catch (err) {
    next(err);
  }
};

exports.comprarEstilo = async (req, res, next) => {
  try {
    const { id_estilo } = req.body;
    const nombre_usuario = req.user.nombre_usuario;
    const success = await storeService.comprarEstilo(id_estilo, nombre_usuario);
    res.json({ success });
  } catch (err) {
    next(err);
  }
};

exports.modificarVisibilidadAvatar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const success = await storeService.modificarVisibilidadAvatar(id, visible);
    res.json({ success });
  } catch (err) {
    next(err);
  }
};

exports.modificarVisibilidadEstilo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const success = await storeService.modificarVisibilidadEstilo(id, visible);
    res.json({ success });
  } catch (err) {
    next(err);
  }
};