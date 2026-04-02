//== NO SIRVE, ESTA TODO EN EL SERVICE ==

// src/core/start-game/partida.manager.js
/*const db = require('../../config/db');
const Partida = require('./partida');
const userService = require('../../modules/user/userService');

const NUM_MAX_JUGADORES_PARTIDA_PUBLICA = 4;

// Buscar partida pública para unirse
async function buscar_partida_publica_unirse() {
  const { rows } = await db.query(
    'SELECT id_partida FROM PARTIDA WHERE estado=$1 LIMIT 1', 
    ["esperando jugadores"]
  );

  if (!rows.length) {
    // No hay partida disponible, crear una por defecto
    const config_partida = new Partida(); // usa la clase limpia
    return crear_partida(config_partida);
  }

  return rows[0].id_partida;
}

// Unirse a una partida existente
async function unirse_partida_validacion(id_partida, id_usuario) {
  const client = await db.getClient(); // asegúrate de usar client para transacciones
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT COUNT(*) AS jugadores FROM USUARIO_EN_PARTIDA WHERE id_partida=$1',
      [id_partida]
    );

    const { rows: infoPartida } = await client.query(
      'SELECT estado, max_jugadores FROM PARTIDA WHERE id_partida=$1',
      [id_partida]
    );

    if (!infoPartida.length || infoPartida[0].estado !== "esperando jugadores") {
      throw new Error("Partida ya iniciada o no existe");
    }

    if (rows[0].jugadores < infoPartida[0].max_jugadores) {
      const { rows: result } = await client.query(
        'INSERT INTO USUARIO_EN_PARTIDA (id_usuario, id_partida) VALUES ($1,$2) RETURNING id_partidaUsuario',
        [id_usuario, id_partida]
      );
      await client.query('COMMIT');
      return result[0].id_partidaUsuario;
    } else {
      throw new Error("Partida completa");
    }

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Abandonar partida
async function abandonar_partida(id_partida, id_usuario) {
  const { rows } = await db.query(
    'DELETE FROM USUARIO_EN_PARTIDA WHERE id_usuario=$1 AND id_partida=$2',
    [id_usuario, id_partida]
  );
  return rows;
}

// Crear partida
async function crear_partida(config_partida) {
  const { rows } = await db.query(
    `INSERT INTO PARTIDA
      (num_cartas_inicio, modo_cartas_especiales, modo_roles, sonido, musica, vibracion, estado, timeout_turno, max_jugadores, partida_publica)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id_partida`,
    [
      config_partida.getNumCartasInicio(),
      config_partida.getModoCartasEspeciales(),
      config_partida.getModoRoles(),
      config_partida.getSonido(),
      config_partida.getMusica(),
      config_partida.getVibracion(),
      config_partida.getEstado(),
      config_partida.getTimeoutTurno(),
      config_partida.getMaxJugadores(),
      config_partida.getPartidaPublica()
    ]
  );

  return rows[0].id_partida;
}

// Cambiar estado
async function iniciar_partida(id_partida) {
  const { rows } = await db.query(
    'UPDATE PARTIDA SET estado=$1 WHERE id_partida=$2',
    ["en curso", id_partida]
  );
  return rows;
}

async function pausar_partida(id_partida) {
  const { rows } = await db.query(
    'UPDATE PARTIDA SET estado=$1 WHERE id_partida=$2',
    ["pausada", id_partida]
  );
  return rows;
}

async function terminar_partida(id_partida, nombre_user_ganador) {
  const { rows: usuarios } = await db.query(
    'SELECT id_usuario FROM USUARIO_EN_PARTIDA WHERE id_partida=$1',
    [id_partida]
  );

  for (const u of usuarios) {
    await userService.anadir_Partida_jugada_ById(u.id_usuario);
  }

  await userService.anadirPartidaGanada_ById(nombre_user_ganador);

  await db.query('DELETE FROM USUARIO_EN_PARTIDA WHERE id_partida=$1', [id_partida]);
  const { rows } = await db.query('DELETE FROM PARTIDA WHERE id_partida=$1', [id_partida]);
  return rows;
}

module.exports = {
  buscar_partida_publica_unirse,
  unirse_partida_validacion,
  abandonar_partida,
  crear_partida,
  iniciar_partida,
  pausar_partida,
  terminar_partida
};*/