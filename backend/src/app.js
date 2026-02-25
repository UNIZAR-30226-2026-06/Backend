const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// importar y registrar rutas de auth
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);

//rutas de store
const storeRoutes = require('./modules/store/store.routes.js');
app.use('/store', storeRoutes);

module.exports = app;