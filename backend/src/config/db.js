const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables del archivo .env

// Verificamos que la URL exista
if (!process.env.DATABASE_URL) {
  console.error("Falta la variable DATABASE_URL en el archivo .env");
  process.exit(1);
}

/*const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
*/

// Creamos el Pool de conexiones usando la URL de Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // obligatorio para bd en la nube (Neon)
  }
});

// Comprobamos la conexión automáticamente al importar este archivo
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a Neon.tech:', err.stack);
  } else {
    console.log('Conectado a PostgreSQL en Neon. Hora del servidor:', res.rows[0].now);
  }
});

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a la DB', err);
});

module.exports = pool;
