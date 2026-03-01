const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const userController = require('./user.controller');

const router = express.Router();

// Todo requiere autenticación
router.use(authMiddleware);

// Obtener perfil
router.get('/me', userController.getProfile);

// Editar datos básicos
router.put('/me', userController.updateProfile);

// Cambiar contraseña
router.put('/me/password', userController.changePassword);

// Cambiar avatar activo
router.put('/me/avatar', userController.changeAvatar);

// Cambiar estilo activo
router.put('/me/estilo', userController.changeStyle);

module.exports = router;