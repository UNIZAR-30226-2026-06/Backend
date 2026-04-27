const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const rolController = require('./rol.controller');

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Gestión de roles en partida
 */

router.use(authMiddleware);

router.get('/:gameId/me', rolController.obtenerMiRol);
router.get('/:gameId/me/uses', rolController.obtenerMisUsos);
router.post('/:gameId/use', rolController.usarRol);

module.exports = router;