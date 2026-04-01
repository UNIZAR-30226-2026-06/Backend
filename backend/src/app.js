const express = require('express');

const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origen no permitido por CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefijo global de la API
const API_PREFIX = '/api/v1';

// rutas de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok' });
});


// --------------------
// CONFIGURACIÓN SWAGGER
// --------------------
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de NotUno',
      version: '1.0.0',
      description: 'Documentación de la API para el juego NotUno',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1' // Todo partirá de aquí
      }
    ],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, 'modules', '**', '*.js')
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// --------------------
// IMPORTAR RUTAS
// --------------------
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const storeRoutes = require('./modules/store/store.routes');
const walletRoutes = require('./modules/wallet/wallet.routes');
const friendsRoutes = require('./modules/friends/friends.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const gameRoutes = require('./modules/game/game.routes');


// --------------------
// REGISTRAR RUTAS
// --------------------
app.use(`${API_PREFIX}/usuarios`, userRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/store`, storeRoutes);
app.use(`${API_PREFIX}/wallet`, walletRoutes);
app.use(`${API_PREFIX}/friends`, friendsRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);
app.use(`${API_PREFIX}/partidas`, gameRoutes);

app.use('/docs', express.static('docs'));

module.exports = app;