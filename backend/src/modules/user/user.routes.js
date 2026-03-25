const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const userController = require('./user.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión del perfil de usuario y configuraciones
 */

// Todo requiere autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /usuarios/me:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre_usuario:
 *                   type: string
 *                   example: "gonzalo"
 *                 correo:
 *                   type: string
 *                   example: "gonzalo@email.com"
 *                 avatar:
 *                   type: integer
 *                   example: 1
 *                 estilo:
 *                   type: integer
 *                   example: 2
 *                 victorias:
 *                   type: integer
 *                   example: 10
 *                 partidas:
 *                   type: integer
 *                   example: 25
 *                 monedas:
 *                   type: integer
 *                   example: 1500
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Editar datos básicos del perfil (ej. correo)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

/**
 * @swagger
 * /usuarios/me/password:
 *   put:
 *     summary: Cambiar la contraseña del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasena_actual:
 *                 type: string
 *               nueva_contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña actual incorrecta
 */
router.put('/me/password', userController.changePassword);

/**
 * @swagger
 * /usuarios/me/avatar:
 *   put:
 *     summary: Cambiar el avatar activo
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Avatar actualizado
 */
router.put('/me/avatar', userController.changeAvatar);

/**
 * @swagger
 * /usuarios/me/estilo:
 *   put:
 *     summary: Cambiar el estilo activo
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estilo_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estilo actualizado
 */
router.put('/me/estilo', userController.changeStyle);

/**
 * @swagger
 * /usuarios/me/avatares:
 *   get:
 *     summary: Obtener los avatares comprados del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avatares comprados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_avatar:
 *                     type: integer
 *                   image:
 *                     type: string
 *                   precioavatar:
 *                     type: integer
 */
router.get('/me/avatares', userController.getAvataresComprados);

/**
 * @swagger
 * /usuarios/me/estilos:
 *   get:
 *     summary: Obtener los estilos comprados del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estilos comprados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_estilo:
 *                     type: integer
 *                   precioestilo:
 *                     type: integer
 */
router.get('/me/estilos', userController.getEstilosComprados);

module.exports = router;