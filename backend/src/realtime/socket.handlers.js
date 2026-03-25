const { joinUserRoom } = require('./rooms.manager');
const db = require('../config/db');
const { processMessage } = require('../modules/chat/chatService');

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

async function crear_room(io, partidaID) {
    io.join(partidaID)

}

 function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    const username = socket.user?.nombre_usuario;
    if (!username) {
      socket.disconnect(true);
      return;
    }

    console.log("Usuario ", socket.user?.nombre_usuario, " envia peticion de conexion")

    
    socket.on(`newMessage`, data => {
      const mensaje_filtrado=processMessage(username, data.mensaje)
      socket.emit('mensajeMostrar', mensaje_filtrado) //respondo al que me envia el mensaje con el mensaje correcto
      socket.to(data.partidaID).emit('nuevoMensajeChat',mensaje_filtrado)   //respondo a todo el grupo excepto a que me envia (ya se lo he mandado antes)
    })

    socket.on(`prueba_recibida`, data => {
      console.log("he recibido mensaje: ", data.mensaje, "\n le contesto: te estoy contestando")
      socket.emit('respuesta', "te estoy contestando") //respondo al que me envia el mensaje con el mensaje correcto
    })

    socket.on('pendingFriendRequests', async () =>  {
      try {
        const res=await getPendingFriendRequests(username) 
        socket.emit(`res_pendingFriendRequests`, res.json())


      } catch (err) {
        next(err)
      }
    })
    


    
  });
}

module.exports = {
  registerSocketHandlers
};
