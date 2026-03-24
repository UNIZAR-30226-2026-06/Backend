const { joinUserRoom } = require('./rooms.manager');

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    const username = socket.user?.nombre_usuario;
    if (!username) {
      socket.disconnect(true);
      return;
    }

    joinUserRoom(socket, username);
    socket.emit('socket:ready', { connected: true, usuario: username });
  });
}

module.exports = {
  registerSocketHandlers
};
