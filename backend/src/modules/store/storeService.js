const db = require('../../config/db');

async function obtenerAvataresTienda() {
  const result = await db.query(`
    SELECT
      id_avatar,
      nombre,
      image,
      precioavatar
    FROM notuno.AVATAR
  `);

  return result.rows;
}

async function obtenerAvatarporId(id) {
  const result = await db.query(`
    SELECT
      id_avatar,
      nombre,
      image,
      precioavatar
    FROM notuno.AVATAR
    WHERE id_avatar=$1
  `, [id]);

  return result.rows;
}

async function obtenerEstilosTienda() {
  const result = await db.query(`
    SELECT
      id_estilo,
      nombre,
      image,
      precioestilo
    FROM notuno.ESTILO
  `);

  return result.rows;
}

async function obtenerEstiloporId(id) {
  const result = await db.query(`
    SELECT
      id_estilo,
      nombre,
      image,
      precioestilo
    FROM notuno.ESTILO
    WHERE id_estilo=$1
  `, [id]);

  return result.rows;
}

module.exports = {
  obtenerAvataresTienda,
  obtenerEstilosTienda,
  obtenerEstiloporId,
  obtenerAvatarporId
};