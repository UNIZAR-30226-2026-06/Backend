const db = require('../../config/db');

async function crearPartida(id_creador, config) {

  const result = await db.query(
  `INSERT INTO notuno.partida
   (num_cartas_inicio, modo_cartas_especiales, modo_roles, sonido, musica, vibracion, estado, timeout_turno, max_jugadores)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
   RETURNING id_partida, estado`,
  [
    config.numCartasInicio,
    config.modoCartasEspeciales,
    config.modoRoles,
    config.sonido ?? true,
    config.musica ?? true,
    config.vibracion ?? true,
    'esperando_jugadores', 
    config.timeoutTurno ?? 30,
    config.maxJugadores
  ]
);

  return result.rows[0];
}

module.exports = {
  crearPartida
};