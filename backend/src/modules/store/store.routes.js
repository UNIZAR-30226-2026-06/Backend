const express = require('express');
const router = express.Router();
const storeController = require('./store.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/avatars', storeController.obtenerAvataresTienda);
router.get('/estilos', storeController.obtenerEstilosTienda);

router.post('/purchase/avatar/:id', authMiddleware, storeController.comprarAvatar);
router.post('/purchase/estilo/:id', authMiddleware, storeController.comprarEstilo);

router.patch('/avatar/:id/visibilidad', authMiddleware, storeController.modificarVisibilidadAvatar);
router.patch('/estilo/:id/visibilidad', authMiddleware, storeController.modificarVisibilidadEstilo);

module.exports = router;