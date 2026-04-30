// ================= CHAT ROUTES =================
const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Sistema de mensajería entre usuarios
 */

/**
 * @swagger
 * /chat/match:
 *   post:
 *     summary: Enviar un mensaje en un chat de partida (match)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partida_id:
 *                 type: integer
 *                 description: ID de la partida
 *               mensaje:
 *                 type: string
 *                 maxLength: 150
 *                 description: Contenido del mensaje (máximo 150 caracteres)
 *             required:
 *               - mensaje
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     remitente:
 *                       type: string
 *                     texto:
 *                       type: string
 *                     hora:
 *                       type: string
 *                       format: date-time
 *                     partidaId:
 *                       type: integer
 *       400:
 *         description: Error al enviar el mensaje (mensaje vacío)
 *       401:
 *         description: No autorizado
 */
/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Enviar un mensaje (alias de /match)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partida_id:
 *                 type: integer
 *                 description: ID de la partida
 *               mensaje:
 *                 type: string
 *                 maxLength: 150
 *                 description: Contenido del mensaje (máximo 150 caracteres)
 *             required:
 *               - mensaje
 *     responses:
 *       200:
 *         description: Mensaje enviado correctamente
 *       400:
 *         description: Error al enviar el mensaje
 *       401:
 *         description: No autorizado
 */
router.post('/match', chatController.sendMatchMessage);
router.post('/send', chatController.sendMatchMessage); // alias compatible con tests y clientes antiguos

module.exports = router;