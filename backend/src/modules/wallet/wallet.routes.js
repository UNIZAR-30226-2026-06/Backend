// ================= WALLET ROUTES =================
const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/balance', walletController.getBalance);
router.post('/add', walletController.addCoins);
router.post('/deduct', walletController.deductCoins);
router.post('/purchase/avatar', walletController.purchaseAvatar);

module.exports = router;