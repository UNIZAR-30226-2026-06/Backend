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

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de NotUno',
      version: '1.0.0',
      description: 'Documentación de la API para el juego NotUno',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  // Le decimos a Swagger dónde buscar los comentarios (ajusta la ruta según tu carpeta)
  apis: [
    './src/modules/**/*.js', // Si ejecutas desde la raíz del proyecto
    './modules/**/*.js'      // Si ejecutas desde dentro de src
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar rutas de user
const userRoutes = require('./modules/user/user.routes');
app.use('/api/v1/usuarios', userRoutes);



// importar y registrar rutas de auth
const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);

module.exports = app;