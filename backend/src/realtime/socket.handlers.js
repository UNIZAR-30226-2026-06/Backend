const { joinUserRoom } = require('./rooms.manager');
const db = require('../config/db');
const { processMessage } = require('../modules/chat/chatService');
const {authService} = require('../modules/auth/auth.controller');
const {chatController} = require('../modules/chat/chat.controller');
const {friendsService}=require('../modules/friends/friendsService');
const { Socket } = require('socket.io');
const {gameService}=require('../modules/game/gameService')
const { activeGames } = require('../core/game-engine/game.registry');



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

    socket.on('unirse_room_partida', (partidaID) => {
      socket.join(partidaID);
      console.log(`Usuario ${username} se unió a la room de la partida: ${partidaID}`);
    });
    
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
        socket.emit(`res_pendingFriendRequests`, res)


      } catch (err) {
        console.error("Error en pendingFriendRequests:", err);
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

    socket.on('avisarAmigosConectados_UserOnline',async () => {
      const amigos=await friendsService.obtenerAmigos(username)
      for (const i in amigos) {
        if (connectedUsers.has(i)) {
          socket.to(connectedUsers.get(id)).emit(`amigoConectado`, username)
        }
      }
    })
    socket.on('avisarAmigosConectados_UserDisconnect',async () => {
      const amigos=await friendsService.obtenerAmigos(username)
      for (const i in amigos) {
        if (connectedUsers.has(i)) {
          socket.to(connectedUsers.get(id)).emit(`amigoDesconectado`, username)
        }
      }
    })

    

    socket.on('start_game', async (data) => {
      //tareas a realizar para implementar una partida
      //me llega cuando estan todos los jugadores preparados para iniciar la partida,la partida ya esta creada, tiene id y asigno a cada jugador su mano inicial, y les envio un mensaje a cada uno con su mano inicial y el id de la partida a la que se han unido
      
      partidaID=data.partidaID
      
      
      await gameService.iniciarPartida(partidaID, username) //iniciar partida para que se pueda jugar
      //obtener el estado de la partida despues de iniciarla
      const gameState = activeGames.get(partidaID);
      if (!gameState) throw new Error("No se ha podido recuperar el estado del juego");

      //envio a cada jugador su mano inicial y el id de la partida a la que se han unido y el modo de juego
      gameState.players.forEach(jugador => {
        if (connectedUsers.has(jugador)) {
          //envio a cada jugador su mano inicial y el id de la partida a la que se han unido
          io.to(connectedUsers.get(jugador)).emit(`partida_iniciada`, {partidaID: partidaID, manoInicial: player.hand, modoJuego: gameState.rolesMode ? 'roles' : (gameState.specialCardsMode ? 'cards' : 'normal')}) //enviar mensaje a cada jugador con su mano inicial y el id de la partida a la que se han unido
          
        }
      });
    })

    socket.on('comprobar_turno', async (data) => {
      //comprobar turno valido y enviar mensaje indicando si es valido o no (solo al jugador que ha jugado el turno)
      try{
        await gameService.jugarCarta(data.partidaID, username, data.cartaId) //comprobar si el turno es valido y jugar la carta, si no es valido se lanza una excepcion que se captura en el controlador y se envia un mensaje de error al jugador
      } catch (error) {
        socket.emit('turno_invalido', {message: error.message})
      }
      //si llega aqui el turno es valido, se envia un evento indicando el siguiente jugador y si tiene que robar cartas o no
      
      io.to(data.partidaID).emit('turno_siguiente', {siguienteJugador: siguiente.jugador, cartasRobar: siguiente.cartasRobar}) //enviar mensaje a todos los jugadores de la partida indicando el siguiente jugador
      //se le indica tambien si tiene que robar alguna carta, tendra que emitir eventos para robar cartas si es necesario

    })

    

    socket.on('robar_carta', async (data) => {
      //robar carta y enviar mensaje al jugador que ha robado la carta con la carta robada
      cartaRobada=await gameService.robarCarta(data.partidaID, username) //robar carta para el jugador que ha robado la carta
      socket.emit('carta_robada', {carta: cartaRobada}) //enviar mensaje al jugador que ha robado la carta con la carta robada
    })

    socket.on('unirse_partida',async (data) => {
      //unirse a la partida y enviar mensaje a los jugadores de la partida indicando que se ha unido un nuevo jugador
      await gameService.unirsePartida(data.partidaID, username);
      //al unirse a la partida se une a la room de la partida para recibir los mensajes de la partida
      socket.join(data.partidaID);
      socket.to(data.partidaID).emit('nuevo_jugador', {jugador: username}) //enviar mensaje a todos los jugadores de la partida indicando que se ha unido un nuevo jugador
    });

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
