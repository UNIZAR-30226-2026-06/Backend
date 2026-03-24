const { joinUserRoom } = require('./rooms.manager');
const db = require('../config/db');

async function getPendingFriendRequests(username) {
  const result = await db.query(
    `SELECT id_usuario_origen, id_usuario_destino, estado
     FROM notuno.SOLICITUD_AMISTAD
     WHERE id_usuario_destino = $1 AND estado = 'pendiente'
     ORDER BY id_usuario_origen ASC`,
    [username]
  );
  return result.rows;
}

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    const username = socket.user?.nombre_usuario;
    if (!username) {
      socket.disconnect(true);
      return;
    }

    joinUserRoom(socket, username);
    socket.emit('socket:ready', { connected: true, usuario: username });

    getPendingFriendRequests(username)
      .then((solicitudes) => {
        socket.emit('friends:request:pending', solicitudes);
      })
      .catch(() => {
        socket.emit('friends:request:pending', []);
      });
  });
}

module.exports = {
  registerSocketHandlers
};
