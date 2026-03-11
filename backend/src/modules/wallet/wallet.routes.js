// wallet.routes.js
const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// ================= Middleware de autenticación =================
router.use(authMiddleware);

// ================= WALLET ROUTES =================

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Gestión de monedas del usuario
 */

/**
 * @swagger
 * /api/v1/wallet/balance:
 *   get:
 *     summary: Obtener balance de monedas del usuario
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
 * /api/v1/wallet/add:
 *   post:
 *     summary: Añadir monedas al usuario
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
 * /api/v1/wallet/deduct:
 *   post:
 *     summary: Restar monedas al usuario
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
 * /api/v1/wallet/purchase/avatar:
 *   post:
 *     summary: Comprar un avatar con monedas
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
 *               - avatarId
 *             properties:
 *               avatarId:
 *                 type: string
 *                 example: "avatar_dragon"
 *     responses:
 *       200:
 *         description: Avatar comprado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coins:
 *                   type: integer
 *                   example: 900
 *                 avatarUnlocked:
 *                   type: string
 *                   example: avatar_dragon
 *       400:
 *         description: No hay monedas suficientes o avatar inválido
 *       401:
 *         description: No autorizado
 */
router.post('/purchase/avatar', walletController.purchaseAvatar);

module.exports = router;