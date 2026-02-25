require('dotenv').config();

const env = {
  // Puerto del servidor (usa el del .env, y si no existe, usa el 3000)
  port: process.env.PORT || 3000,
  
  // Configuración de la Base de Datos (Neon)
  db: {
    url: process.env.DATABASE_URL,
  },
  
};


if (!env.db.url) {
  console.error('ERROR CRÍTICO: Falta la variable DATABASE_URL en el archivo .env');
  process.exit(1); // El 1 significa que la app se cierra por un error
}

module.exports = env;