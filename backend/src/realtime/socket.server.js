const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { registerSocketHandlers } = require('./socket.handlers');

const { emitToUser } = require('./rooms.manager');

let io = null;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function normalizeToken(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return null;
  return rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;
}

function extractTokenFromSocket(socket) {
  const authToken = normalizeToken(socket.handshake?.auth?.token);
  if (authToken) return authToken;

  const headerAuth = socket.handshake?.headers?.authorization;
  if (headerAuth && headerAuth.startsWith('Bearer ')) {
    return headerAuth.split(' ')[1];
  }

  return normalizeToken(socket.handshake?.query?.token);
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origen no permitido por CORS (Socket.IO)'));
      },
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
      console.warn('[socket] autenticacion fallida:', err.message);
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
  console.log(`[socket] friends:request:received -> ${receiverUsername}`);
  emitToUser(io, receiverUsername, 'friends:request:received', payload);
}

function notifyPendingRequests(receiverUsername, pendingRequests) {
  if (!io) return;
  console.log(`[socket] friends:request:pending -> ${receiverUsername} (${pendingRequests.length})`);
  emitToUser(io, receiverUsername, 'friends:request:pending', pendingRequests);
}



module.exports = {
  initSocket,
  getIO,
  notifyFriendRequest,
  notifyPendingRequests
};
