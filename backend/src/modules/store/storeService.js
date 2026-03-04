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

async function obtener_avatar_por_id(id_avatar) {
  const result = await db.query('SELECT * FROM notuno.AVATAR WHERE id_avatar = $1', [id_avatar]);
  return result.rows[0];
}

async function obtener_estilo_por_id(id_estilo) {
  const result = await db.query('SELECT * FROM notuno.ESTILO WHERE id_estilo = $1', [id_estilo]);
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

async function estilo_ya_comprado(id_estilo, nombre_usuario) {
  const result = await db.query('SELECT COUNT(*) AS total FROM notuno.ESTILOS_COMPRADOS WHERE nombre_usuario = $1 AND id_estilo = $2', [nombre_usuario, id_estilo]);
  return parseInt(result.rows[0].total) > 0;
}

async function avatar_ya_comprado(id_avatar, nombre_usuario) {
  const result = await db.query('SELECT COUNT(*) AS total FROM notuno.AVATARES_COMPRADOS WHERE nombre_usuario = $1 AND id_avatar = $2', [nombre_usuario, id_avatar]);
  return parseInt(result.rows[0].total) > 0;
}

async function comprar_avatar(id_avatar, nombre_usuario) {
  const avatar = await obtener_avatar_por_id(id_avatar);
  if (!avatar) throw new Error("Avatar no encontrado");

  const monedas_user_actual = await userService.getMonedasById(nombre_usuario);
  if (monedas_user_actual < avatar.precioAvatar) throw new Error("No tienes suficientes monedas para comprar este avatar");

  await userService.setMonedasById(nombre_usuario, monedas_user_actual - avatar.precioAvatar);
  const result = await db.query('INSERT INTO notuno.AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)', [nombre_usuario, id_avatar]);
  return result.rowCount === 1;
}

async function comprar_estilo(id_estilo, nombre_usuario) {
  const estilo = await obtener_estilo_por_id(id_estilo);
  if (!estilo) throw new Error("Estilo no encontrado");

  const monedas_user_actual = await userService.getMonedasById(nombre_usuario);
  if (monedas_user_actual < estilo.precioEstilo) throw new Error("No tienes suficientes monedas para comprar este estilo");

  await userService.setMonedasById(nombre_usuario, monedas_user_actual - estilo.precioEstilo);
  const result = await db.query('INSERT INTO notuno.ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)', [nombre_usuario, id_estilo]);
  return result.rowCount === 1;
}

async function modificar_visibilidad_estilo_tienda(id_estilo, visible) {
  const result = await db.query('UPDATE notuno.ESTILO SET muestroEstilo = $1 WHERE id_estilo = $2', [visible, id_estilo]);
  return result.rowCount === 1;
}

async function modificar_visibilidad_avatar_tienda(id_avatar, visible) {
  const result = await db.query('UPDATE notuno.AVATAR SET muestoAvatar = $1 WHERE id_avatar = $2', [visible, id_avatar]);
  return result.rowCount === 1;
}

async function obtener_avatares_tienda() {
  const result = await db.query('SELECT * FROM notuno.AVATAR WHERE muestoAvatar = $1', [true]);
  return result.rows;
}

async function obtener_estilos_tienda() {
  const result = await db.query('SELECT * FROM notuno.ESTILO WHERE muestroEstilo = $1', [true]);
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
  comprar_avatar,
  comprar_estilo,
  modificar_visibilidad_avatar_tienda,
  modificar_visibilidad_estilo_tienda,
  obtener_avatares_tienda,
  obtener_estilos_tienda
};