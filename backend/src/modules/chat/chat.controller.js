// ================= CHAT CONTROLLER =================
const chatService = require('./chatService');

exports.sendMatchMessage = async (req, res) => {
    try {
        const { partida_id, mensaje } = req.body;
        const nombre_usuario = req.user?.nombre_usuario;

        if (!nombre_usuario) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const partidaId = partida_id || req.body.partidaID || null;

        if (!mensaje) {
            return res.status(400).json({ message: 'Error al enviar el mensaje' });
        }

        const mensajeProcesado = chatService.processMessage(nombre_usuario, mensaje, { partidaId });

        if (partidaId) {
            try {
                const { getIO } = require('../../realtime/socket.server');
                const io = getIO();
                io.to(partidaId).emit('nuevoMensajeChat', mensajeProcesado);
            } catch (emitError) {
                console.warn('No se pudo emitir mensaje de chat por socket:', emitError.message);
            }
        }

        return res.status(200).json({ message: 'Mensaje enviado correctamente', data: mensajeProcesado });
    } catch (error) {
        console.error('Error en sendMatchMessage:', error);
        return res.status(400).json({ message: 'Error al enviar el mensaje' });
    }
};