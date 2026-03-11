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
 *                 description: Contenido del mensaje
 *             required:
 *               - partida_id
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

module.exports = router;