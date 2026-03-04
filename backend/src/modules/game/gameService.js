const db = require('../../config/db');

async function crearPartida(id_creador) {
    const estado_inicial = 'waiting';

    const result = await db.query(
        'INSERT INTO PARTIDA (id_creador, estado) VALUES ($1, $2) RETURNING id_partida, estado',
        [id_creador, estado_inicial]
    );

    return result.rows[0]; // Devuelve { id_partida, estado }
}

module.exports = {
    crearPartida
};