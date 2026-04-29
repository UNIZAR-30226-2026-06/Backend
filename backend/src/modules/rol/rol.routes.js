const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const rolController = require('./rol.controller');

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Gestión de roles en partida
 */

router.use(authMiddleware);

/**
 * @swagger
 * /roles/{gameId}/me:
 *   get:
 *     summary: Obtener el rol asignado al jugador en una partida
 *     tags: [Roles]
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
 *         description: Información del rol del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                 playerId:
 *                   type: string
 *                 role:
 *                   type: object
 *                 uses:
 *                   type: integer
 *                 maxUses:
 *                   type: integer
 *                   nullable: true
 *                 lastUsedTurn:
 *                   type: integer
 *                   nullable: true
 *                 canUseNow:
 *                   type: boolean
 *       400:
 *         description: La partida no tiene roles activados o error de parámetro
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Jugador o partida no encontrada
 */
router.get('/:gameId/me', rolController.obtenerMiRol);

/**
 * @swagger
 * /roles/{gameId}/me/uses:
 *   get:
 *     summary: Obtener el número de usos del rol del jugador en la partida
 *     tags: [Roles]
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
 *         description: Uso del rol del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                 playerId:
 *                   type: string
 *                 uses:
 *                   type: integer
 *                 lastUsedTurn:
 *                   type: integer
 *                   nullable: true
 *                 maxUses:
 *                   type: integer
 *                   nullable: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Jugador o partida no encontrada
 */
router.get('/:gameId/me/uses', rolController.obtenerMisUsos);

/**
 * @swagger
 * /roles/{gameId}/use:
 *   post:
 *     summary: Usar la habilidad del rol en la partida
 *     tags: [Roles]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetPlayerId:
 *                 type: string
 *               ownCardId:
 *                 type: string
 *               cardId:
 *                 type: string
 *               newColor:
 *                 type: string
 *               newNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rol usado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 role:
 *                   type: object
 *                 result:
 *                   type: object
 *       400:
 *         description: Error en el uso del rol o partida no válida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No es el turno del jugador o acción prohibida
 *       404:
 *         description: Jugador o partida no encontrada
 */
router.post('/:gameId/use', rolController.usarRol);

module.exports = router;