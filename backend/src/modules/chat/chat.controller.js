// ================= CHAT CONTROLLER =================
const chatService = require('./chatService');

exports.sendMatchMessage = (req, res) => {
    try {
        const { mensaje } = req.body;
        const nombre_usuario = req.user.nombre_usuario;

        const mensajeProcesado = chatService.processMessage(nombre_usuario, mensaje);

        return res.status(200).json(mensajeProcesado);
    } catch (error) {
        if (error.message === 'Mensaje vacío') {
            return res.status(400).json({ message: error.message });
        }

        console.error('Error en sendMatchMessage:', error);
        return res.status(500).json({ message: 'Error procesando mensaje.' });
    }
};