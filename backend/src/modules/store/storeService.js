const db = require('../../config/db');
const userService = require('../user/userService');

async function obtener_todos_avatares() {
  const result = await db.query('SELECT * FROM notuno.AVATAR');
  return result.rows;
}

async function obtener_todos_estilos() {
  const result = await db.query('SELECT * FROM notuno.ESTILO');
  return result.rows;
}

async function obtener_avatar_por_id(id_avatar, client = db) {
  const result = await client.query(`
    SELECT 
      id_avatar,
      muestoavatar AS "muestroAvatar",
      precioavatar AS "precioAvatar"
    FROM notuno.AVATAR
    WHERE id_avatar = $1
  `, [id_avatar]);
  return result.rows[0];
}

async function obtener_estilo_por_id(id_estilo, client = db) {
  const result = await client.query(`
    SELECT
      id_estilo,
      fondo,
      reverso,
      muestroestilo AS "muestroEstilo",
      precioestilo AS "precioEstilo"
    FROM notuno.ESTILO
    WHERE id_estilo = $1
  `, [id_estilo]);

  return result.rows[0];
}

async function obtener_estilos_usuario(nombre_usuario) {
  const result = await db.query(`
    SELECT e.* 
    FROM notuno.ESTILOS_COMPRADOS ec
    JOIN notuno.ESTILO e ON ec.id_estilo = e.id_estilo
    WHERE ec.nombre_usuario = $1
  `, [nombre_usuario]);
  return result.rows;
}

async function obtener_avatares_usuario(nombre_usuario) {
  const result = await db.query(`
    SELECT a.* 
    FROM notuno.AVATARES_COMPRADOS ac
    JOIN notuno.AVATAR a ON ac.id_avatar = a.id_avatar
    WHERE ac.nombre_usuario = $1
  `, [nombre_usuario]);
  return result.rows;
}

async function avatar_ya_comprado(id_avatar, nombre_usuario, client) {
  const result = await client.query(
    'SELECT COUNT(*) AS total FROM notuno.AVATARES_COMPRADOS WHERE nombre_usuario = $1 AND id_avatar = $2',
    [nombre_usuario, id_avatar]
  );
  return parseInt(result.rows[0].total, 10) > 0;
}

async function estilo_ya_comprado(id_estilo, nombre_usuario, client) {
  const result = await client.query(
    'SELECT COUNT(*) AS total FROM notuno.ESTILOS_COMPRADOS WHERE nombre_usuario = $1 AND id_estilo = $2',
    [nombre_usuario, id_estilo]
  );
  return parseInt(result.rows[0].total, 10) > 0;
}

async function comprarAvatar(id_avatar, nombre_usuario) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const avatar = await obtener_avatar_por_id(id_avatar, client);
    if (!avatar) throw new Error('Avatar no encontrado');

    const yaComprado = await avatar_ya_comprado(id_avatar, nombre_usuario, client);
    if (yaComprado) throw new Error('Ya has comprado este avatar');

    const userRes = await client.query(
      'SELECT monedas FROM notuno.USUARIO WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    const monedas = userRes.rows[0].monedas;

    if (monedas < avatar.precioAvatar) throw new Error('No tienes suficientes monedas');

    await client.query(
      'UPDATE notuno.USUARIO SET monedas = $1 WHERE nombre_usuario = $2',
      [monedas - avatar.precioAvatar, nombre_usuario]
    );

    const insertRes = await client.query(
      'INSERT INTO notuno.AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)',
      [nombre_usuario, id_avatar]
    );

    await client.query('COMMIT');
    return insertRes.rowCount === 1;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function comprarEstilo(id_estilo, nombre_usuario) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const estilo = await obtener_estilo_por_id(id_estilo, client);
    if (!estilo) throw new Error('Estilo no encontrado');

    const yaComprado = await estilo_ya_comprado(id_estilo, nombre_usuario, client);
    if (yaComprado) throw new Error('Ya has comprado este estilo');

    const userRes = await client.query(
      'SELECT monedas FROM notuno.USUARIO WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    const monedas = userRes.rows[0].monedas;

    if (monedas < estilo.precioEstilo) throw new Error('No tienes suficientes monedas');

    await client.query(
      'UPDATE notuno.USUARIO SET monedas = $1 WHERE nombre_usuario = $2',
      [monedas - estilo.precioEstilo, nombre_usuario]
    );

    const insertRes = await client.query(
      'INSERT INTO notuno.ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)',
      [nombre_usuario, id_estilo]
    );

    await client.query('COMMIT');
    return insertRes.rowCount === 1;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function modificar_visibilidad_avatar_tienda(id_avatar, visible) {
  const result = await db.query(
    'UPDATE notuno.AVATAR SET muestoavatar = $1 WHERE id_avatar = $2',
    [visible, id_avatar]
  );
  return result.rowCount === 1;
}

async function modificar_visibilidad_estilo_tienda(id_estilo, visible) {
  const result = await db.query(
    'UPDATE notuno.ESTILO SET muestroestilo = $1 WHERE id_estilo = $2',
    [visible, id_estilo]
  );
  return result.rowCount === 1;
}

async function obtenerAvataresTienda() {
  const result = await db.query(`
    SELECT
      id_avatar,
      nombre AS "nombreAvatar",
      imagen AS "imagenAvatar",
      muestoavatar AS "muestroAvatar",
      precioavatar AS "precioAvatar"
    FROM notuno.AVATAR
    WHERE muestoavatar = $1
  `, [true]);

  return result.rows;
}

async function obtenerEstilosTienda() {
  const result = await db.query(`
    SELECT
      id_estilo,
      fondo,
      reverso,
      muestroestilo AS "muestroEstilo",
      precioestilo AS "precioEstilo"
    FROM notuno.ESTILO
    WHERE muestroestilo = $1
  `, [true]);

  return result.rows;
}

module.exports = {
  obtener_todos_avatares,
  obtener_todos_estilos,
  obtener_avatar_por_id,
  obtener_estilo_por_id,
  obtener_estilos_usuario,
  obtener_avatares_usuario,
  estilo_ya_comprado,
  avatar_ya_comprado,
  comprarAvatar,
  comprarEstilo,
  modificar_visibilidad_avatar_tienda,
  modificar_visibilidad_estilo_tienda,
  obtenerAvataresTienda,
  obtenerEstilosTienda
};