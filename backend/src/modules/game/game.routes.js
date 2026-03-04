const express = require('express');
const router = express.Router();
const gameController = require('./game.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Crear partida (POST /partidas)
// Solo usuarios autenticados
router.post('/', authMiddleware, gameController.crearPartida);

module.exports = router;