// ================= FRIENDS CONTROLLER =================
const friendsService = require('./friendsService');

exports.enviarSolicitud = async (req, res, next) => {
    try {
        const sender = req.user.nombre_usuario;
        const receiver = req.params.id; // espera nombre_usuario del receptor

        if (sender === receiver) {
            return res.status(400).json({ message: "No puedes enviarte solicitud a ti mismo." });
        }

        await friendsService.enviarSolicitud(sender, receiver);
        res.status(201).json({ message: "Solicitud enviada." });
    } catch (err) {
        next(err);
    }
};

exports.cancelarSolicitud = async (req, res, next) => {
    try {
        const sender = req.user.nombre_usuario;
        const receiver = req.params.id;
        await friendsService.cancelarSolicitud(sender, receiver);
        res.json({ message: "Solicitud cancelada." });
    } catch (err) {
        next(err);
    }
};

exports.aceptarSolicitud = async (req, res, next) => {
    try {
        const usuario = req.user.nombre_usuario;
        const nuevoAmigo = req.params.id;
        await friendsService.aceptarSolicitud(usuario, nuevoAmigo);
        res.json({ message: "Solicitud aceptada." });
    } catch (err) {
        next(err);
    }
};

exports.rechazarSolicitud = async (req, res, next) => {
    try {
        const usuario = req.user.nombre_usuario;
        const nuevoAmigo = req.params.id;
        await friendsService.rechazarSolicitud(usuario, nuevoAmigo);
        res.json({ message: "Solicitud rechazada." });
    } catch (err) {
        next(err);
    }
};

exports.obtenerSolicitudesPendientes = async (req, res, next) => {
    try {
        const usuario = req.user.nombre_usuario;
        const solicitudes = await friendsService.obtenerSolicitudesPendientes(usuario);
        res.json(solicitudes);
    } catch (err) {
        next(err);
    }
};

exports.obtenerAmigos = async (req, res, next) => {
    try {
        const usuario = req.user.nombre_usuario;
        const amigos = await friendsService.obtenerAmigos(usuario);
        res.json(amigos);
    } catch (err) {
        next(err);
    }
};

exports.eliminarAmigo = async (req, res, next) => {
    try {
        const usuario = req.user.nombre_usuario;
        const amigo = req.params.id;
        await friendsService.eliminarAmigo(usuario, amigo);
        res.json({ message: "Amigo eliminado." });
    } catch (err) {
        next(err);
    }
};

exports.buscarUsuarios = async (req, res, next) => {
    try {
        const query = req.params.query;
        const usuarioActual = req.user.nombre_usuario;
        const usuarios = await friendsService.buscarUsuarios(query, usuarioActual);
        res.json(usuarios);
    } catch (err) {
        next(err);
    }
};