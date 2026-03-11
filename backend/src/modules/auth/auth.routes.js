const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const authController = require('./auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticación y gestión de sesiones
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               contrasena:
 *                 type: string
 *             required:
 *               - nombre_usuario
 *               - correo
 *               - contrasena
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos o usuario ya existente
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
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
 *               contrasena:
 *                 type: string
 *             required:
 *               - correo
 *               - contrasena
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Obtener un nuevo access token usando refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *       401:
 *         description: Refresh token inválido o expirado
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;