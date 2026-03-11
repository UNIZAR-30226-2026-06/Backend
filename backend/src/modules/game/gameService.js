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


async function unirsePartida(gameId, username) {

  await db.query(
    `INSERT INTO notuno.jugador_partida (id_partida, nombre_usuario)
     VALUES ($1,$2)`,
    [gameId, username]
  );

  return { message: "Jugador unido a la partida" };
}

async function empezarPartida(gameId, username) {

  await db.query(
    `UPDATE notuno.partida
     SET estado = 'en_curso'
     WHERE id_partida = $1`,
    [gameId]
  );

  return { message: "Partida iniciada" };
}

async function obtenerPartida(gameId) {

  const result = await db.query(
    `SELECT id_partida, estado, max_jugadores
     FROM notuno.partida
     WHERE id_partida = $1`,
    [gameId]
  );

  return result.rows[0];
}

async function obtenerEstadoPartida(gameId, username) {

  const partida = await db.query(
    `SELECT estado
     FROM notuno.partida
     WHERE id_partida = $1`,
    [gameId]
  );

  const jugadores = await db.query(
    `SELECT nombre_usuario
     FROM notuno.jugador_partida
     WHERE id_partida = $1`,
    [gameId]
  );

  return {
    gameId,
    estado: partida.rows[0].estado,
    jugadores: jugadores.rows
  };
}

module.exports = {
  crearPartida,
  unirsePartida,
  empezarPartida,
  obtenerPartida,
  obtenerEstadoPartida
};