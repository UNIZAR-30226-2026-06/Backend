const express = require('express');
const router = express.Router();
const chatService = require('./chat.service');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/match', (req, res) => {
    try {
        const { mensaje } = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const mensajeProcesado = chatService.processMatchMessage (
            nombre_usuario,
            mensaje
        );
        return res.status(200).json(mensajeProcesado);
    }catch(error){
        if(error.message === 'Mensaje vacío'){
            return res.status(400).json({message: error.message});
        }
        return res.status(500).json({message: 'Error procesando mensaje.'});
    }
});

module.exports = router;