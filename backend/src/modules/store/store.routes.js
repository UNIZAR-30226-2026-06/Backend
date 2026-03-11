// ================= STORE ROUTES =================
const express = require('express');
const router = express.Router();
const storeController = require('./store.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Store
 *     description: Gestión de avatares y estilos en la tienda
 */

/**
 * @swagger
 * /store/avatars:
 *   get:
 *     summary: Obtener lista de avatares disponibles en la tienda
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Lista de avatares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: integer
 *                   visible:
 *                     type: boolean
 *       500:
 *         description: Error interno del servidor
 */
router.get('/avatars', storeController.obtenerAvataresTienda);

/**
 * @swagger
 * /store/estilos:
 *   get:
 *     summary: Obtener lista de estilos disponibles en la tienda
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Lista de estilos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: integer
 *                   visible:
 *                     type: boolean
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estilos', storeController.obtenerEstilosTienda);

/**
 * @swagger
 * /store/purchase/avatar:
 *   post:
 *     summary: Comprar un avatar de la tienda
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_avatar:
 *                 type: integer
 *             required:
 *               - id_avatar
 *     responses:
 *       200:
 *         description: Compra realizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: id_avatar inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/purchase/avatar', authMiddleware, storeController.comprarAvatar);

/**
 * @swagger
 * /store/purchase/estilo:
 *   post:
 *     summary: Comprar un estilo de la tienda
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estilo:
 *                 type: integer
 *             required:
 *               - id_estilo
 *     responses:
 *       200:
 *         description: Compra realizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: id_estilo inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/purchase/estilo', authMiddleware, storeController.comprarEstilo);

/**
 * @swagger
 * /store/avatar/{id}/visibilidad:
 *   patch:
 *     summary: Modificar la visibilidad de un avatar
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del avatar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visible:
 *                 type: boolean
 *             required:
 *               - visible
 *     responses:
 *       200:
 *         description: Visibilidad modificada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/avatar/:id/visibilidad', authMiddleware, storeController.modificarVisibilidadAvatar);

/**
 * @swagger
 * /store/estilo/{id}/visibilidad:
 *   patch:
 *     summary: Modificar la visibilidad de un estilo
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estilo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visible:
 *                 type: boolean
 *             required:
 *               - visible
 *     responses:
 *       200:
 *         description: Visibilidad modificada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/estilo/:id/visibilidad', authMiddleware, storeController.modificarVisibilidadEstilo);

module.exports = router;