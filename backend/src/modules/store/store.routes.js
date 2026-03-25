// ================= STORE ROUTES =================
const express = require('express');
const router = express.Router();
const storeController = require('./store.controller');

/**
 * @swagger
 * tags:
 *   - name: Store
 *     description: Catálogo de avatares y estilos disponibles en la tienda
 */

/**
 * @swagger
 * /store/avatars:
 *   get:
 *     summary: Obtener avatares disponibles en la tienda
 *     description: Devuelve únicamente los avatares visibles (muestro_avatar = true)
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Lista de avatares disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_avatar:
 *                     type: integer
 *                     example: 1
 *                   nombre_avatar:
 *                     type: string
 *                     example: "Guerrero"
 *                   image:
 *                     type: string
 *                     example: "avatar1.png"
 *                   precio_avatar:
 *                     type: integer
 *                     example: 500
 *       500:
 *         description: Error interno del servidor
 */
router.get('/avatars', storeController.obtenerAvataresTienda);

/**
 * @swagger
 * /store/estilos/{id}:
 *   get:
 *     summary: Obtiene avatar a partir del id
 *     description: Devuelve la informacion relacionada con un estilo a partir del id
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Estilo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
*                   id_estilo:
*                     type: integer
*                     example: 1
*                   nombre_estilo:
*                     type: string
*                     example: "Fuego oscuro"
*                   fondo:
*                     type: string
*                     example: "fondo1.png"
*                   reverso:
*                     type: string
*                     example: "reverso1.png"
*                   precio_estilo:
*                     type: integer
*                     example: 300
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estilos/:id', storeController.obtenerEstiloID);

/**
 * @swagger
 * /store/avatars/{id}:
 *   get:
 *     summary: Obtener avatares por id
 *     description: Devuelve la informacion relacionada con un avatar a partir del id
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Avatar
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id_avatar:
 *                     type: integer
 *                     example: 1
 *                   nombre_avatar:
 *                     type: string
 *                     example: "Guerrero"
 *                   image:
 *                     type: string
 *                     example: "avatar1.png"
 *                   precio_avatar:
 *                     type: integer
 *                     example: 500
 *       500:
 *         description: Error interno del servidor
 */
router.get('/avatars/:id', storeController.obtenerAvatarID);

/**
 * @swagger
 * /store/estilos:
 *   get:
 *     summary: Obtener estilos disponibles en la tienda
 *     description: Devuelve únicamente los estilos visibles (muestro_estilo = true)
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Lista de estilos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_estilo:
 *                     type: integer
 *                     example: 1
 *                   nombre_estilo:
 *                     type: string
 *                     example: "Fuego oscuro"
 *                   fondo:
 *                     type: string
 *                     example: "fondo1.png"
 *                   reverso:
 *                     type: string
 *                     example: "reverso1.png"
 *                   precio_estilo:
 *                     type: integer
 *                     example: 300
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estilos', storeController.obtenerEstilosTienda);

module.exports = router;
