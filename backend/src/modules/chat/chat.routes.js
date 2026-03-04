const express = require('express');
const router = express.Router();
const chatService = require('./chat.service');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/match', chatController, (req, res));
   
module.exports = router;