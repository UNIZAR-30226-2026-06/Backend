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

async function obtenerEstilosTienda() {
  const result = await db.query(`
    SELECT
      id_estilo,
      nombre,
      precioestilo
    FROM notuno.ESTILO
  `);

  return result.rows;
}

module.exports = {
  obtenerAvataresTienda,
  obtenerEstilosTienda
};