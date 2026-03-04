// ================= CHAT ROUTES =================
const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/match', chatController.sendMatchMessage);

module.exports = router;