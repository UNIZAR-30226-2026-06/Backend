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
        next(err);
    }
};

exports.cancelarSolicitud = async (req, res) => {
    try {
        const id_sender = req.user.id;
        const id_receiver = parseInt(req.params.id);
        await friendsModel.eliminar_solicitud_amistad(id_sender, id_receiver);
        res.json({ message: "Solicitud cancelada." });

    } catch (error) {
        next(err);
    }
};

exports.aceptarSolicitud = async (req, res) => {
    try {
        const id = req.user.id;
        const id_nuevo_amigo = parseInt(req.params.id);
        await friendsModel.aceptar_Solicitud_Amistad(id, id_nuevo_amigo);
        res.json({ message: "Solicitud aceptada." });

    } catch (error) {
        next(err);
    }
};

exports.rechazarSolicitud = async (req, res) => {
    try {
        const id = req.user.id;
        const id_nuevo_amigo = parseInt(req.params.id);
        await friendsModel.rechazar_Solicitud_Amistad(id, id_nuevo_amigo);
        res.json({ message: "Solicitud rechazada." });

    } catch (error) {
        next(err);
    }
};

exports.obtenerSolicitudesPendientes = async (req, res) => {
    try {
        const id = req.user.id;
        const solicitudes = await friendsModel.obtener_Solicitudes_Pendientes(id);
        res.json(solicitudes);

    } catch (error) {
        next(err);
    }
};

exports.obtenerAmigos = async (req, res) => {
    try {
        const id = req.user.id;
        const amigos = await friendsModel.obtener_amigos(id);
        res.json(amigos);

    } catch (error) {
        next(err);
    }
};

exports.eliminarAmigo = async (req, res) => {
    try {
        const id = req.user.id;
        const id_amigo = parseInt(req.params.id);
        await friendsModel.eliminar_amigo(id, id_amigo);
        res.json({ message: "Amigo eliminado." });

    } catch (error) {
        next(err);
    }
};

exports.buscarUsuarios = async (req, res) => {
    try {
        const query = req.params.query;
        const id_actual = req.user.id;
        const usuarios = await friendsModel.buscar_amigos(query, id_actual);
        res.json(usuarios);

    } catch (error) {
        next(err);
    }
};