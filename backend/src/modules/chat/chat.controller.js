// ================= CHAT CONTROLLER =================
const chatService = require('./chatService');

exports.sendMatchMessage = async (req, res) => {
    try {
        const { partida_id, mensaje } = req.body;
        const nombre_usuario = req.user?.nombre_usuario;

        if (!nombre_usuario) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        if (!mensaje || !partida_id) {
            return res.status(400).json({ message: 'Error al enviar el mensaje' });
        }

        const mensajeProcesado = await chatService.processMessage(nombre_usuario, partida_id, mensaje);

        return res.status(200).json({ message: 'Mensaje enviado correctamente', data: mensajeProcesado });
    } catch (error) {
        console.error('Error en sendMatchMessage:', error);
        return res.status(400).json({ message: 'Error al enviar el mensaje' });
    }
};