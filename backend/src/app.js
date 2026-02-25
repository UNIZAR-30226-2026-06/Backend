const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

//prueba de la bd
/*const pool = require('./src/config/db');
app.get('/api/v1/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo conectar a la DB' });
  }
});*/

module.exports = app;