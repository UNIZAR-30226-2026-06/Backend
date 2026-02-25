const db = require('../../config/db');
const user = require('../user/userService.js'); // para monedas y usuario

// Obtener todos los avatares
async function obtener_todos_avatares() {
  const result = await db.query('SELECT * FROM notuno.AVATAR');
  return result.rows;
}

// Obtener todos los estilos
async function obtener_todos_estilos() {
  const result = await db.query('SELECT * FROM notuno.ESTILO');
  return result.rows;
}

// Obtener avatar por id
async function obtener_avatar_por_id(id_avatar) {
  const result = await db.query('SELECT * FROM notuno.AVATAR WHERE id_avatar = $1', [id_avatar]);
  return result.rows[0];
}

// Obtener estilo por id
async function obtener_estilo_por_id(id_estilo) {
  const result = await db.query('SELECT * FROM notuno.ESTILO WHERE id_estilo = $1', [id_estilo]);
  return result.rows[0];
}

// Estilos de un usuario
async function obtener_estilos_usuario(nombre_usuario) {
  const result = await db.query(`
    SELECT e.* FROM notuno.ESTILOS_COMPRADOS ec
    JOIN notuno.ESTILO e ON ec.id_estilo = e.id_estilo
    WHERE ec.nombre_usuario = $1
  `, [nombre_usuario]);
  return result.rows;
}

// Avatar de un usuario
async function obtener_avatares_usuario(nombre_usuario) {
  const result = await db.query(`
    SELECT a.* FROM notuno.AVATARES_COMPRADOS ac
    JOIN notuno.AVATAR a ON ac.id_avatar = a.id_avatar
    WHERE ac.nombre_usuario = $1
  `, [nombre_usuario]);
  return result.rows;
}

// Comprobar si ya se compró
async function estilo_ya_comprado(id_estilo, nombre_usuario) {
  const result = await db.query(`
    SELECT COUNT(*) as total FROM notuno.ESTILOS_COMPRADOS
    WHERE nombre_usuario=$1 AND id_estilo=$2
  `, [nombre_usuario, id_estilo]);
  return parseInt(result.rows[0].total) > 0;
}

async function avatar_ya_comprado(id_avatar, nombre_usuario) {
  const result = await db.query(`
    SELECT COUNT(*) as total FROM notuno.AVATARES_COMPRADOS
    WHERE nombre_usuario=$1 AND id_avatar=$2
  `, [nombre_usuario, id_avatar]);
  return parseInt(result.rows[0].total) > 0;
}

// Comprar avatar
async function comprar_avatar(id_avatar, nombre_usuario) {
  const avatarRes = await db.query('SELECT precioAvatar FROM notuno.AVATAR WHERE id_avatar=$1', [id_avatar]);
  if (avatarRes.rows.length === 0) throw new Error('Avatar no encontrado');

  const precio = avatarRes.rows[0].precioavatar; // cuidado con minúsculas por PG
  const monedas_user = await user.getMonedasById(nombre_usuario);

  if (monedas_user < precio) throw new Error('No tienes suficientes monedas');

  await user.setMonedasById(nombre_usuario, monedas_user - precio);
  const result = await db.query('INSERT INTO notuno.AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)', [nombre_usuario, id_avatar]);
  return result.rowCount === 1;
}

// Comprar estilo
async function comprar_estilo(id_estilo, nombre_usuario) {
  const estiloRes = await db.query('SELECT precioEstilo FROM notuno.ESTILO WHERE id_estilo=$1', [id_estilo]);
  if (estiloRes.rows.length === 0) throw new Error('Estilo no encontrado');

  const precio = estiloRes.rows[0].precioestilo;
  const monedas_user = await user.getMonedasById(nombre_usuario);

  if (monedas_user < precio) throw new Error('No tienes suficientes monedas');

  await user.setMonedasById(nombre_usuario, monedas_user - precio);
  const result = await db.query('INSERT INTO notuno.ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)', [nombre_usuario, id_estilo]);
  return result.rowCount === 1;
}

// Modificar visibilidad tienda
async function modificar_visibilidad_avatar_tienda(id_avatar, visible) {
  const result = await db.query('UPDATE notuno.AVATAR SET muestoAvatar=$1 WHERE id_avatar=$2', [visible, id_avatar]);
  return result.rowCount === 1;
}

async function modificar_visibilidad_estilo_tienda(id_estilo, visible) {
  const result = await db.query('UPDATE notuno.ESTILO SET muestoEstilo=$1 WHERE id_estilo=$2', [visible, id_estilo]);
  return result.rowCount === 1;
}

// Obtener avatares/estilos visibles en tienda
async function obtener_avatares_tienda() {
  const result = await db.query('SELECT * FROM notuno.AVATAR WHERE muestoAvatar = true');
  return result.rows;
}

async function obtener_estilos_tienda() {
  const result = await db.query('SELECT * FROM notuno.ESTILO WHERE muestroEstilo = true');
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