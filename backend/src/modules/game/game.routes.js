// game.routes.js
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

// ================= CREAR PARTIDA =================
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   example: "abc123"
 *                 max_jugadores:
 *                   type: integer
 *                   example: 4
 *                 privada:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, gameController.crearPartida);

// ================= UNIRSE A PARTIDA =================
/**
 * @swagger
 * /partidas/{gameId}/join:
 *   post:
 *     summary: Unirse a una partida existente
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida a unirse
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasena:
 *                 type: string
 *                 description: Contraseña si la sala es privada
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Usuario agregado a la partida
 *       400:
 *         description: Error al unirse (partida llena o contraseña incorrecta)
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/join', authMiddleware, gameController.unirsePartida);

// ================= EMPEZAR PARTIDA =================
/**
 * @swagger
 * /partidas/{gameId}/start:
 *   post:
 *     summary: Iniciar una partida
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida a iniciar
 *     responses:
 *       200:
 *         description: Partida iniciada correctamente
 *       400:
 *         description: No se puede iniciar la partida (menos de 2 jugadores)
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/start', authMiddleware, gameController.empezarPartida);

// ================= OBTENER PARTIDA =================
/**
 * @swagger
 * /partidas/{gameId}:
 *   get:
 *     summary: Obtener información básica de la partida
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
 *         description: Información básica de la partida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   example: "abc123"
 *                 jugadores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["user1", "user2"]
 *                 estado:
 *                   type: string
 *                   example: "pendiente"
 *       401:
 *         description: No autorizado
 */
router.get('/:gameId', authMiddleware, gameController.obtenerPartida);

// ================= OBTENER ESTADO COMPLETO =================
/**
 * @swagger
 * /partidas/{gameId}/state:
 *   get:
 *     summary: Obtener el estado completo de la partida (para renderizar el juego)
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
 *         description: Estado completo de la partida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   example: "abc123"
 *                 turnoActual:
 *                   type: string
 *                   example: "user1"
 *                 cartasEnMano:
 *                   type: object
 *                   example: { "user1": ["red1", "blue2"], "user2": ["yellow3"] }
 *                 pila:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["red5", "green2"]
 *                 direccion:
 *                   type: string
 *                   example: "clockwise"
 *                 estado:
 *                   type: string
 *                   example: "jugando"
 *       401:
 *         description: No autorizado
 */
router.get('/:gameId/state', authMiddleware, gameController.obtenerEstadoPartida);

/**
 * @swagger
 * /partidas/{gameId}/pause:
 *   post:
 *     summary: Pausar una partida en curso
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida a pausar
 *     responses:
 *       200:
 *         description: Partida pausada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Partida pausada
 *       400:
 *         description: Error en la petición
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Partida no encontrada
 */
router.post('/:gameId/pause', authMiddleware, gameController.pausarPartida);

/**
 * @swagger
 * /partidas/{gameId}/end:
 *   post:
 *     summary: Finalizar una partida
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida a finalizar
 *     responses:
 *       200:
 *         description: Partida finalizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Partida finalizada
 *       400:
 *         description: Error en la petición
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Partida no encontrada
 */
router.post('/:gameId/end', authMiddleware, gameController.finalizarPartida);

module.exports = router;