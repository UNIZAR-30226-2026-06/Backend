const express = require('express');
const router = express.Router();

const WalletController = require('./wallet.controller');
const authMiddleware = require('../../middleware/auth.Middleware');

router.get('/balance', authMiddleware, WalletController.getBalance);
router.post('/add', authMiddleware, WalletController.addCoins);
router.post('/deduct', authMiddleware, WalletController.deductCoins);

module.exports = router;
