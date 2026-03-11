const express = require('express');
const router = express.Router();
const gameController = require('./game.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Partidas
 *     description: Gestión y creación de partidas
 */

/**
 * @swagger
 * /partidas:
 *   post:
 *     summary: Crear una nueva partida
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               max_jugadores:
 *                 type: integer
 *                 description: Número máximo de jugadores permitidos
 *                 example: 4
 *               privada:
 *                 type: boolean
 *                 description: Si la partida es privada o pública
 *                 example: false
 *               contrasena:
 *                 type: string
 *                 description: Contraseña de la sala (si es privada)
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Partida creada exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, gameController.crearPartida);

module.exports = router;