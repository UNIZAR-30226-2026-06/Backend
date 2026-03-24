// Cargar dotenv
require('dotenv').config({ path: __dirname + '/../.env' });

// ⚠️ Comprobación rápida
console.log('VARIABLES DE ENTORNO CARGADAS:');
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('PORT =', process.env.PORT);
console.log('JWT_SECRET =', process.env.JWT_SECRET);

const app = require('./app');
const errorMiddleware = require('./middlewares/error.middleware');
const http = require('http');
const { initSocket } = require('./realtime/socket.server');

const PORT = process.env.PORT || 3000;

app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});