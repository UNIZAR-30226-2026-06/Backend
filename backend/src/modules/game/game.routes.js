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
 * /partidas/join:
 *   post:
 *     summary: Unirse automáticamente a la primera partida pública disponible
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario unido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unido correctamente
 *                 gameId:
 *                   type: string
 *                   description: ID de la partida pública a la que se unió
 *       400:
 *         description: Error (partida llena o no válida)
 *       404:
 *         description: No hay partidas públicas disponibles
 *       401:
 *         description: No autorizado
 */
router.post('/join', authMiddleware, gameController.unirsePartidaPublica);

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

// ================= START =================
/**
 * @swagger
 * /partidas/{gameId}/start:
 *   post:
 *     summary: Iniciar una partida (solo creador)
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
 *         description: Partida iniciada correctamente
 *       400:
 *         description: Error al iniciar la partida
 *       403:
 *         description: Solo el creador puede iniciar
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/start', authMiddleware, gameController.iniciarPartida);

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

/**
 * @swagger
 * /partidas/{gameId}/play-card:
 *   post:
 *     summary: Jugar una carta en la partida
 *     tags:
 *       - Partidas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: ID de la carta que el jugador quiere jugar
 *             required:
 *               - cardId
 *     responses:
 *       200:
 *         description: Carta jugada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error en los parámetros o turno inválido
 *       403:
 *         description: No autorizado para jugar en este turno
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:gameId/play-card', authMiddleware, gameController.jugarCarta);

/**
 * @swagger
 * /partidas/{gameId}/draw-card:
 *   post:
 *     summary: Robar una carta durante el turno del jugador
 *     tags:
 *       - Partidas
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
 *         description: Carta robada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cardDrawn:
 *                   type: object
 *                   description: Carta que fue robada por el jugador
 *       400:
 *         description: Error en los parámetros o turno inválido
 *       403:
 *         description: No autorizado para robar en este turno
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:gameId/draw-card', authMiddleware, gameController.robarCarta);

/**
 * @swagger
 * /partidas/{gameId}/add-bot:
 *   post:
 *     summary: Añadir un bot a la partida (solo el creador puede hacerlo)
 *     tags:
 *       - Partidas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: ID de la partida
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bot añadido correctamente a la partida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 botId:
 *                   type: string
 *                   example: Bot_8492
 *       400:
 *         description: Error (la partida ya ha comenzado)
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Error (solo el creador puede añadir bots)
 */
router.post('/:gameId/add-bot', authMiddleware, gameController.añadirBot);

// ================= PAUSE =================
/**
 * @swagger
 * /partidas/{gameId}/pause:
 *   post:
 *     summary: Solicitar pausa de la partida
 *     description: Permite a un jugador solicitar pausar la partida. Puede requerir consenso según la lógica del juego.
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
 *         description: Pausa solicitada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paused:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Partida en pausa"
 *       400:
 *         description: No se puede pausar en el estado actual
 *       403:
 *         description: No autorizado para pausar
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/pause', authMiddleware, gameController.solicitarPausa);

// ================= RESUME =================
/**
 * @swagger
 * /partidas/{gameId}/resume:
 *   post:
 *     summary: Reanudar la partida pausada
 *     description: Permite reanudar una partida que está actualmente en pausa.
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
 *         description: Partida reanudada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paused:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Partida reanudada"
 *       400:
 *         description: La partida no está en pausa
 *       403:
 *         description: No autorizado para reanudar
 *       404:
 *         description: Partida no encontrada
 *       401:
 *         description: No autorizado
 */
router.post('/:gameId/resume', authMiddleware, gameController.reanudarPartida);

module.exports = router;