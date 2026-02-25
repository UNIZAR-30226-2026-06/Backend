const express = require('express');
const router = express.Router();
const friendsController = require('./friends.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/request/:id', friendsController.enviarSolicitud);

router.delete('/request/:id', friendsController.cancelarSolicitud);

router.put('/request/:id/accept', friendsController.aceptarSolicitud);

router.put('/request/:id/reject', friendsController.rechazarSolicitud);

router.get('/requests/pending', friendsController.obtenerSolicitudesPendientes);

router.get('/', friendsController.obtenerAmigos);

router.delete('/:id', friendsController.eliminarAmigo);

router.get('/search/:query', friendsController.buscarUsuarios);

module.exports = router;