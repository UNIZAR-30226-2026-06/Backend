const express = require('express');
const router = express.Router();
const gameController = require('./game.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Partidas
 *     description: Gestión de partidas multijugador
 */

// ================= CREAR =================
/**
 * @swagger
 * /partidas:
 *   post:
 *     summary: Crear una nueva partida (pública o privada)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxJugadores:
 *                 type: integer
 *                 example: 4
 *               privada:
 *                 type: boolean
 *                 example: true
 *               modoCartasEspeciales:
 *                 type: boolean
 *                 example: true
 *               modoRoles:
 *                 type: boolean
 *                 example: false
 *               numCartasInicio:
 *                 type: integer
 *                 example: 7
 *               timeoutTurno:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Partida creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   example: "uuid-partida"
 *                 codigo:
 *                   type: string
 *                   nullable: true
 *                   example: "A1B2C3"
 *       400:
 *         description: Error en los datos
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, gameController.crearPartida);

// ================= JOIN =================
/**
 * @swagger
 * /partidas/{gameId}/join:
 *   post:
 *     summary: Unirse a una partida pública
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     responses:
 *       200:
 *         description: Usuario unido correctamente
 *       400:
 *         description: Error (partida llena o no válida)
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/join', authMiddleware, gameController.unirsePartida);

// ================= JOIN PRIVADA =================
/**
 * @swagger
 * /partidas/join-by-code:
 *   post:
 *     summary: Unirse a una partida privada mediante código
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "A1B2C3"
 *     responses:
 *       200:
 *         description: Usuario unido correctamente
 *       400:
 *         description: Código inválido o partida no disponible
 *       401:
 *         description: No autorizado
 */
router.post('/join-by-code', authMiddleware, gameController.unirsePorCodigo);

// ================= LOBBY =================
/**
 * @swagger
 * /partidas/{gameId}:
 *   get:
 *     summary: Obtener información básica de la partida (lobby)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     responses:
 *       200:
 *         description: Información de la partida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                 estado:
 *                   type: string
 *                   example: "esperando_jugadores"
 *                 maxJugadores:
 *                   type: integer
 *                   example: 4
 *                 jugadores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["user1", "user2"]
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/:gameId', authMiddleware, gameController.obtenerPartida);

// ================= STATE =================
/**
 * @swagger
 * /partidas/{gameId}/state:
 *   get:
 *     summary: Obtener el estado completo de la partida (render del juego)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     responses:
 *       200:
 *         description: Estado completo del juego
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                 phase:
 *                   type: string
 *                   example: "playing"
 *                 currentTurn:
 *                   type: string
 *                   example: "user1"
 *                 direction:
 *                   type: string
 *                   example: "clockwise"
 *                 discardTop:
 *                   type: string
 *                   example: "red_5"
 *                 drawCount:
 *                   type: integer
 *                   example: 30
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       hand:
 *                         oneOf:
 *                           - type: array
 *                           - type: integer
 *                       connected:
 *                         type: boolean
 *       400:
 *         description: Error al obtener estado
 *       401:
 *         description: No autorizado
 */
router.get('/:gameId/state', authMiddleware, gameController.obtenerEstadoPartida);

// ================= END =================
/**
 * @swagger
 * /partidas/{gameId}/end:
 *   post:
 *     summary: Finalizar una partida (solo creador)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     responses:
 *       200:
 *         description: Partida finalizada correctamente
 *       403:
 *         description: No autorizado para finalizar
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/end', authMiddleware, gameController.finalizarPartida);

module.exports = router;