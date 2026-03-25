const { joinUserRoom } = require('./rooms.manager');
const db = require('../config/db');
const { processMessage } = require('../modules/chat/chatService');
const {authService} = require('../modules/auth/auth.controller');
const {chatController} = require('../modules/chat/chat.controller');
const {friendsService}=require('../modules/friends/friendsService');
const { Socket } = require('socket.io');


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
const connectedUsers=new Map();

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    const username = socket.user?.nombre_usuario;
    if (!username) {
      socket.disconnect(true);
      return;
    }

    console.log("Usuario ", socket.user?.nombre_usuario, " envia peticion de conexion")
    //me guardo el id del socket para enviarle mensajes solo a el
    connectedUsers.set(username, socket.id)


    
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

    socket.on('newFriendRequest', async (id) =>  {
      if (connectedUsers.has(id)) {
        socket.to(connectedUsers.get(id)).emit(`mostrarFriendRequest`, username)

      }
    })

    socket.on('newFriendRequestAccepted', async (id) =>  {
      if (connectedUsers.has(id)) {
        socket.to(connectedUsers.get(id)).emit(`mostrarAceptadaFriendRequest`, username)

      }
    })

    socket.on('newFriendRequestReject', async (id) =>  {
      if (connectedUsers.has(id)) {
        socket.to(connectedUsers.get(id)).emit(`mostrarRechazadaFriendRequest`, username)

      }
    })

    socket.on('avisarAmigosConectados_UserOnline',() => {
      const amigos=friendsService.obtenerAmigos(username)
      for (const i in amigos) {
        if (connectedUsers.has(i)) {
          socket.to(connectedUsers.get(id)).emit(`amigoConectado`, username)
        }
      }
    })
    socket.on('avisarAmigosConectados_UserDisconnect',() => {
      const amigos=friendsService.obtenerAmigos(username)
      for (const i in amigos) {
        if (connectedUsers.has(i)) {
          socket.to(connectedUsers.get(id)).emit(`amigoDesconectado`, username)
        }
      }
    })

    

    socket.on('start_game', (data) => {
      //tareas a realizar para implementar una partida

    })

    socket.on('next_turn', (data) => {
      //comprobar turno valido y enviar mensaje a siguiente jugador de que es su turno
    })

    socket.on('disconnect', () => {
      if(username) {
        connectedUsers.delete(username)
      }
    })
    


    
  });
}

module.exports = {
  registerSocketHandlers, connectedUsers
};
