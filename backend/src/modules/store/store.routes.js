const express = require('express');
const router = express.Router();
const storeController = require('./store.controller');

// Listar todos los avatares/estilos
router.get('/avatars', storeController.obtenerAvataresTienda);
router.get('/estilos', storeController.obtenerEstilosTienda);

// Comprar avatar/estilo
router.post('/avatar/comprar', storeController.comprarAvatar);
router.post('/estilo/comprar', storeController.comprarEstilo);

// Modificar visibilidad (solo admin o sistema)
router.patch('/avatar/:id/visibilidad', storeController.modificarVisibilidadAvatar);
router.patch('/estilo/:id/visibilidad', storeController.modificarVisibilidadEstilo);

module.exports = router;