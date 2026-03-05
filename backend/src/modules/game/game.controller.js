const gameService = require('./gameService');

async function crearPartida(req, res, next) {
    try {
        const id_creador = req.user.nombre_usuario; // cogemos del token
        const partida = await gameService.crearPartida(id_creador);

        res.status(201).json({
            id_partida: partida.id_partida,
            estado: partida.estado
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crearPartida
};