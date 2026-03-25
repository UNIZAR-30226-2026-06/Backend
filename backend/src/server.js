// Cargar dotenv
require('dotenv').config({ path: __dirname + '/../.env' });
const socket_func=require('./socket/socket'); 

// ⚠️ Comprobación rápida
console.log('VARIABLES DE ENTORNO CARGADAS:');
console.log('DATABASE_URL =', process.env.DATABASE_URL);
console.log('PORT =', process.env.PORT);
console.log('JWT_SECRET =', process.env.JWT_SECRET);

const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
/*const server = http.createServer(app);
const io=new Server(server)

//se crea un websocket que el usuario cliente usara para unirse a rooms para cada partida
io.on('connection',(socket) => {
    console.log('usuario conectado a socket: ', socket.id);

    socket.on('conectarse_partida', (partidaID, nombre_usuario) => {
      socket.join(partidaID);
      io.to(partidaID).emit('jugador_unido',nombre_usuario);
    });



    socket.on('siguiente_turno', (nombre_usuario) => {
      console.log('jugador pasa turno')
    });
})*/

const errorMiddleware = require('./middlewares/error.middleware');

const { initSocket } = require('./realtime/socket.server');

const PORT = process.env.PORT || 3000;

app.use(errorMiddleware);

const server = http.createServer(app);
const io=initSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = {server}