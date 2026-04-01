// Cargar dotenv
require('dotenv').config({ path: __dirname + '/../.env' });

// ⚠️ Comprobación rápida
console.log('VARIABLES DE ENTORNO CARGADAS:');
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('PORT =', process.env.PORT);
console.log('JWT_SECRET =', process.env.JWT_SECRET);

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');


const errorMiddleware = require('./middlewares/error.middleware');

const { initSocket } = require('./realtime/socket.server');

const { startTurnWorker } = require('./core/game-engine/turn.worker');

startTurnWorker(); // ✅ arranca el worker global al iniciar el backend

const PORT = process.env.PORT || 3000;

app.use(errorMiddleware);

app.use('/docs', express.static('docs'));

//se crea un websocket que el usuario cliente usara para unirse a rooms para cada partida
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = {server}