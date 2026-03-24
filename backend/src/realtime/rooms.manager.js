function userRoom(nombreUsuario) {
  return `user:${nombreUsuario}`;
}

function joinUserRoom(socket, nombreUsuario) {
  socket.join(userRoom(nombreUsuario));
}

function emitToUser(io, nombreUsuario, eventName, payload) {
  io.to(userRoom(nombreUsuario)).emit(eventName, payload);
}

module.exports = {
  userRoom,
  joinUserRoom,
  emitToUser
};
