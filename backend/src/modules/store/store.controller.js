const storeService = require('./storeService.js');

exports.obtenerAvataresTienda = async (req, res) => {
  try {
    const avatares = await storeService.obtener_avatares_tienda();
    res.json(avatares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerEstilosTienda = async (req, res) => {
  try {
    const estilos = await storeService.obtener_estilos_tienda();
    res.json(estilos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.comprarAvatar = async (req, res) => {
  try {
    const { id_avatar, nombre_usuario } = req.body;
    const result = await storeService.comprar_avatar(id_avatar, nombre_usuario);
    res.json({ success: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.comprarEstilo = async (req, res) => {
  try {
    const { id_estilo, nombre_usuario } = req.body;
    const result = await storeService.comprar_estilo(id_estilo, nombre_usuario);
    res.json({ success: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modificarVisibilidadAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const result = await storeService.modificar_visibilidad_avatar_tienda(id, visible);
    res.json({ success: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modificarVisibilidadEstilo = async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const result = await storeService.modificar_visibilidad_Estilo_tienda(id, visible);
    res.json({ success: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};