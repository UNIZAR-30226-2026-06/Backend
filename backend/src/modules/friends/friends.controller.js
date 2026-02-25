const friendsModel = require('./friends.model');

exports.enviarSolicitud = async (req, res) => {
    try {
        const id_sender = req.user.id;
        const id_receiver = parseInt(req.params.id);

        if (id_sender === id_receiver) {
            return res.status(400).json({ message: "No puedes enviarte solicitud a ti mismo." });
        }

        await friendsModel.enviar_Solicitud_Amistad(id_sender, id_receiver);

        res.status(201).json({ message: "Solicitud enviada." });

    } catch (error) {
        res.status(500).json({ message: "Error al enviar solicitud.", error });
    }
};

exports.cancelarSolicitud = async (req, res) => {
    try {
        const id_sender = req.user.id;
        const id_receiver = parseInt(req.params.id);

        await friendsModel.eliminar_solicitud_amistad(id_sender, id_receiver);

        res.json({ message: "Solicitud cancelada." });

    } catch (error) {
        res.status(500).json({ message: "Error al cancelar solicitud.", error });
    }
};

exports.aceptarSolicitud = async (req, res) => {
    try {
        const id = req.user.id;
        const id_nuevo_amigo = parseInt(req.params.id);

        await friendsModel.aceptar_Solicitud_Amistad(id, id_nuevo_amigo);

        res.json({ message: "Solicitud aceptada." });

    } catch (error) {
        res.status(500).json({ message: "Error al aceptar solicitud.", error });
    }
};

exports.rechazarSolicitud = async (req, res) => {
    try {
        const id = req.user.id;
        const id_nuevo_amigo = parseInt(req.params.id);

        await friendsModel.rechazar_Solicitud_Amistad(id, id_nuevo_amigo);

        res.json({ message: "Solicitud rechazada." });

    } catch (error) {
        res.status(500).json({ message: "Error al rechazar solicitud.", error });
    }
};

exports.obtenerSolicitudesPendientes = async (req, res) => {
    try {
        const id = req.user.id;

        const solicitudes = await friendsModel.obtener_Solicitudes_Pendientes(id);

        res.json(solicitudes);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener solicitudes.", error });
    }
};

exports.obtenerAmigos = async (req, res) => {
    try {
        const id = req.user.id;

        const amigos = await friendsModel.obtener_amigos(id);

        res.json(amigos);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener amigos.", error });
    }
};

exports.eliminarAmigo = async (req, res) => {
    try {
        const id = req.user.id;
        const id_amigo = parseInt(req.params.id);

        await friendsModel.eliminar_amigo(id, id_amigo);

        res.json({ message: "Amigo eliminado." });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar amigo.", error });
    }
};

exports.buscarUsuarios = async (req, res) => {
    try {
        const query = req.params.query;
        const id_actual = req.user.id;

        const usuarios = await friendsModel.buscar_amigos(query, id_actual);

        res.json(usuarios);

    } catch (error) {
        res.status(500).json({ message: "Error al buscar usuarios.", error });
    }
};