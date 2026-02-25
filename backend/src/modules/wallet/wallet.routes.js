const express = require('express');
const router = express.Router();

const WalletController = require('./wallet.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/balance', authMiddleware, WalletController.getBalance);
router.post('/add', authMiddleware, WalletController.addCoins);
router.post('/deduct', authMiddleware, WalletController.deductCoins);
router.post('/purchase/avatar', authMiddleware, WalletController.purchaseAvatar);
router.post('/purchase/estilo', authMiddleware, WalletController.purchaseStyle);

module.exports = router;
