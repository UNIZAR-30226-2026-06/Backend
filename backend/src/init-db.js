const fs = require('fs');
const path = require('path');
// Importamos la conexión a la base de datos
const pool = require('./config/db'); 

async function initDB() {
  try {
    console.log('Iniciando la configuración de la base de datos...');

    //Leemos los archivos SQL
    const schemaPath = path.join(__dirname, 'database','01_schema.sql');
    const seedPath = path.join(__dirname, 'database', '02_seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    //Ejecutamos el esquema
    console.log('Creando tablas...');
    await pool.query(schemaSql);
    console.log('Tablas creadas correctamente.');

    //Ejecutamos el seed (Insertar datos)
    console.log('Poblando la base de datos con datos iniciales...');
    await pool.query(seedSql);
    console.log('Datos iniciales insertados correctamente.');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    //Cerramos la conexión para que el script termine en la terminal
    await pool.end();
    console.log('Conexión cerrada. Script finalizado.');
    process.exit(0);
  }
}

// Ejecutamos la función
initDB();