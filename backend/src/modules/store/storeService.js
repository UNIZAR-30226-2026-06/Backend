const db = require('../../config/db');

async function obtenerAvataresTienda() {
  const result = await db.query(`
    SELECT
      id_avatar,
      nombre,
      image,
      precioavatar
    FROM notuno.AVATAR
    WHERE muestro_avatar = true
  `);

  return result.rows;
}

async function obtenerEstilosTienda() {
  const result = await db.query(`
    SELECT
      id_estilo,
      nombre,
      fondo,
      reverso,
      precioestilo
    FROM notuno.ESTILO
    WHERE muestro_estilo = true
  `);

  return result.rows;
}

module.exports = {
  obtenerAvataresTienda,
  obtenerEstilosTienda
};