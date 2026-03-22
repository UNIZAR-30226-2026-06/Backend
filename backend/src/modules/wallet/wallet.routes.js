// ================= WALLET ROUTES =================
const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Todo requiere autenticación
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Gestión de monedas y compras del usuario
 */

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Obtener el balance de monedas del usuario
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coins:
 *                   type: integer
 *                   example: 1500
 *       401:
 *         description: No autorizado
 */
router.get('/balance', walletController.getBalance);

/**
 * @swagger
 * /wallet/add:
 *   post:
 *     summary: Añadir monedas al usuario
 *     description: Incrementa el saldo del usuario (uso interno o recompensas)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 500
 *     responses:
 *       200:
 *         description: Monedas añadidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coins:
 *                   type: integer
 *                   example: 2000
 *       400:
 *         description: Cantidad inválida
 *       401:
 *         description: No autorizado
 */
router.post('/add', walletController.addCoins);

/**
 * @swagger
 * /wallet/deduct:
 *   post:
 *     summary: Restar monedas al usuario
 *     description: Reduce el saldo del usuario si tiene suficientes monedas
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       200:
 *         description: Monedas descontadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coins:
 *                   type: integer
 *                   example: 1200
 *       400:
 *         description: Fondos insuficientes o cantidad inválida
 *       401:
 *         description: No autorizado
 */
router.post('/deduct', walletController.deductCoins);

/**
 * @swagger
 * /wallet/purchase/avatar:
 *   post:
 *     summary: Comprar un avatar
 *     description: Realiza la compra de un avatar si el usuario tiene suficientes monedas y no lo posee previamente
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_avatar
 *             properties:
 *               id_avatar:
 *                 type: integer
 *                 example: 1
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
 *                 monedas:
 *                   type: integer
 *                 avatar_id:
 *                   type: integer
 *       400:
 *         description: Datos inválidos o monedas insuficientes
 *       401:
 *         description: No autorizado
 */
router.post('/purchase/avatar', walletController.purchaseAvatar);

/**
 * @swagger
 * /wallet/purchase/estilo:
 *   post:
 *     summary: Comprar un estilo
 *     description: Realiza la compra de un estilo si el usuario tiene suficientes monedas y no lo posee previamente
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_estilo
 *             properties:
 *               id_estilo:
 *                 type: integer
 *                 example: 2
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
 *                 monedas:
 *                   type: integer
 *                 estilo_id:
 *                   type: integer
 *       400:
 *         description: Datos inválidos o monedas insuficientes
 *       401:
 *         description: No autorizado
 */
router.post('/purchase/estilo', walletController.purchaseEstilo);

module.exports = router;