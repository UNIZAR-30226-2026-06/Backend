// ================= AUTH ROUTES =================
const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const authController = require('./auth.controller');

const router = express.Router();

// Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protegidas
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;