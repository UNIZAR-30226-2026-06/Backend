const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { registerSocketHandlers } = require('./socket.handlers');
const { emitToUser } = require('./rooms.manager');

let io = null;

function extractTokenFromSocket(socket) {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) return authToken;

  const headerAuth = socket.handshake?.headers?.authorization;
  if (headerAuth && headerAuth.startsWith('Bearer ')) {
    return headerAuth.split(' ')[1];
  }

  return socket.handshake?.query?.token || null;
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization']
    }
  });

  io.use((socket, next) => {
    const token = extractTokenFromSocket(socket);
    if (!token) {
      return next(new Error('Token requerido en Socket.IO'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error('Token invalido en Socket.IO'));
    }
  });

  registerSocketHandlers(io);
  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
}

function notifyFriendRequest(receiverUsername, payload) {
  if (!io) return;
  emitToUser(io, receiverUsername, 'friends:request:received', payload);
}

module.exports = {
  initSocket,
  getIO,
  notifyFriendRequest
};
