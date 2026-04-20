// ================= FRIENDS ROUTES =================
const express = require('express');
const router = express.Router();
const friendsController = require('./friends.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Amigos
 *     description: Gestión de amigos y solicitudes
 */

/**
 * @swagger
 * /friends/request/{id}:
 *   post:
 *     summary: Enviar solicitud de amistad
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario al que se envía la solicitud
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud enviada
 *       400:
 *         description: Error al enviar solicitud
 */
router.post('/request/:id', friendsController.enviarSolicitud);

/**
 * @swagger
 * /friends/request/{id}:
 *   delete:
 *     summary: Cancelar solicitud enviada
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud cancelada
 */
router.delete('/request/:id', friendsController.cancelarSolicitud);

/**
 * @swagger
 * /friends/request/{id}/accept:
 *   put:
 *     summary: Aceptar solicitud de amistad
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que envió la solicitud
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud aceptada
 */
router.put('/request/:id/accept', friendsController.aceptarSolicitud);

/**
 * @swagger
 * /friends/request/{id}/reject:
 *   put:
 *     summary: Rechazar solicitud de amistad
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que envió la solicitud
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud rechazada
 */
router.put('/request/:id/reject', friendsController.rechazarSolicitud);

/**
 * @swagger
 * /friends/request/pending:
 *   get:
 *     summary: Obtener solicitudes de amistad recibidas pendientes
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes
 */
router.get('/request/pending', friendsController.obtenerSolicitudesPendientes);

/**
 * @swagger
 * /friends/request/sending:
 *   get:
 *     summary: Obtener solicitudes de amistad enviadas
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes enviadas
 */
router.get('/request/sending', friendsController.obtenerSolicitudesEnviadas);

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Obtener lista de amigos
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de amigos
 */
router.get('/', friendsController.obtenerAmigos);

/**
 * @swagger
 * /friends/count:
 *   get:
 *     summary: Obtener numero de amigos
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Numero de amigos
 */
router.get('/count', friendsController.obtenerNumeroAmigos);

/**
 * @swagger
 * /friends/{id}:
 *   delete:
 *     summary: Eliminar un amigo
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del amigo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Amigo eliminado
 */
router.delete('/:id', friendsController.eliminarAmigo);

/**
 * @swagger
 * /friends/search/{query}:
 *   get:
 *     summary: Buscar usuarios por nombre
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: Texto de búsqueda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_usuario:
 *                     type: string
 *                   monedas:
 *                     type: integer
 *                   avatar:
 *                     type: integer
 */
router.get('/search/:query', friendsController.buscarUsuarios);


/**
 * @swagger
 * /friends/connected:
 *   get:
 *     summary: Obtener amigos en linea
 *     tags: [Amigos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/connected/', friendsController.obtenerAmigosConectados);

module.exports = router;