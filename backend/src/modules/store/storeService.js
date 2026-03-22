const db = require('../../config/db');

async function obtenerAvataresTienda() {
  const result = await db.query(`
    SELECT
      id_avatar,
      image,
      precio_avatar
    FROM notuno.AVATAR
    WHERE muestro_avatar = true
  `);

  return result.rows;
}

async function obtenerEstilosTienda() {
  const result = await db.query(`
    SELECT
      id_estilo,
      fondo,
      reverso,
      precio_estilo
    FROM notuno.ESTILO
    WHERE muestro_estilo = true
  `);

  return result.rows;
}

module.exports = {
  obtenerAvataresTienda,
  obtenerEstilosTienda
};