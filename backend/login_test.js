const bcrypt = require('bcrypt');
const db = require('./src/config/db'); // tu conexión real

(async () => {
  const nombre_usuario = 'demo_test';
  const password = '1234';
  const hash = await bcrypt.hash(password, 10);

  // Inserta usuario temporal
  await db.query(
    `INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3)`,
    [nombre_usuario, hash, 'demo_test@test.com']
  );

  console.log('Usuario temporal creado con hash compatible');

  // Al final puedes borrarlo con:
  // await db.query(`DELETE FROM notuno.USUARIO WHERE nombre_usuario=$1`, [nombre_usuario]);
})();