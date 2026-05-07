const db = require('../config/db');
const { processMessage } = require('../modules/chat/chatService');
const friendsService = require('../modules/friends/friendsService');
const gameService = require('../modules/game/gameService');
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
  io.on('connection', async (socket) => {
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
    
    socket.on('newMessage', data => {
      try {
        const partidaID = data?.partidaID || data?.partidaId;
        if (!partidaID || !data?.mensaje) {
          socket.emit('chat_error', { message: 'partidaID y mensaje son requeridos' });
          return;
        }

        const mensaje_filtrado = processMessage(username, data.mensaje, { partidaId: partidaID });
        socket.emit('mensajeMostrar', mensaje_filtrado); // respondo al que envía el mensaje con el mensaje correcto
        socket.to(partidaID).emit('nuevoMensajeChat', mensaje_filtrado); // respondo al grupo excepto al emisor
      } catch (err) {
        console.error('Error en newMessage:', err.message);
        socket.emit('chat_error', { message: err.message });
      }
    });

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
      const amigos = await friendsService.obtenerAmigos(username);
      if (!Array.isArray(amigos)) return;

      for (const amigo of amigos) {
        const nombreAmigo = typeof amigo === 'object' ? (amigo.nombre_usuario || amigo.name) : amigo;
        if (connectedUsers.has(nombreAmigo)) {
          io.to(connectedUsers.get(nombreAmigo)).emit('amigoConectado', username);
        }
      }
    });

    socket.on('avisarAmigosConectados_UserDisconnect', async () => {
      const amigos = await friendsService.obtenerAmigos(username);
      if (!Array.isArray(amigos)) return;

      for (const amigo of amigos) {
        const nombreAmigo = typeof amigo === 'object' ? (amigo.nombre_usuario || amigo.name) : amigo;
        if (connectedUsers.has(nombreAmigo)) {
          io.to(connectedUsers.get(nombreAmigo)).emit('amigoDesconectado', username);
        }
      }
    });

    

    socket.on('start_game', async (data) => {
      try {
        const { partidaID } = data;
        await gameService.iniciarPartida(partidaID, username);

        const gameState = activeGames.get(partidaID);
        if (!gameState) throw new Error('No se ha podido recuperar el estado del juego');

        gameState.players.forEach((player) => {
          if (!player || !player.id) return;
          const targetSocketId = connectedUsers.get(player.id);
          if (targetSocketId) {
            io.to(targetSocketId).emit('partida_iniciada', {
              gameId: partidaID,
              manoInicial: player.hand,
              mode: gameState.rolesMode ? 'roles' : (gameState.specialCardsMode ? 'cards' : 'normal')
            });
          }
        });
      } catch (error) {
        console.error('Error en start_game:', error.message);
        socket.emit('error_partida', { message: error.message });
      }
    });

    socket.on('comprobar_turno', async (data) => {
      try {
        await gameService.jugarCarta(data.partidaID, username, data.cartaId);

        const gameState = activeGames.get(data.partidaID);
        const nextPlayer = gameState ? gameState.getCurrentPlayer() : null;

        if (nextPlayer) {
          io.to(data.partidaID).emit('turno_siguiente', {
            siguienteJugador: nextPlayer.id,
            cartasRobar: 0
          });
        }
      } catch (error) {
        socket.emit('turno_invalido', { message: error.message });
      }
    });

    socket.on('robar_carta', async (data) => {
      try {
        const cartaRobada = await gameService.robarCarta(data.partidaID, username);
        socket.emit('carta_robada', { carta: cartaRobada });
      } catch (error) {
        socket.emit('error_partida', { message: error.message });
      }
    });

    socket.on('unirse_partida', async (data) => {
      try {
        const { partidaID } = data;
        const usernameSocket = socket.user?.nombre_usuario;

        // Unirse primero a la room para que el cliente reciba eventos de la partida.
        socket.join(partidaID);
        console.log(`Usuario ${usernameSocket} se unió a la room: ${partidaID}`);

        await gameService.unirsePartida(partidaID, usernameSocket);

        // Avisar al resto de jugadores que entró un nuevo usuario.
        socket.to(partidaID).emit('nuevo_jugador', { jugador: usernameSocket });
      } catch (error) {
        socket.emit('error_partida', { message: error.message });
      }
    });

    socket.on("jugador_voto_pausa", async(data) => {
      //un jugador vota para pausar la partida, se envia un mensaje a todos los jugadores de la partida (excepto el que ha votado) indicando que un jugador ha votado para pausar la partida para preguntar si solicita pausarla
      
      const estado = await gameService.votarPausa(data.partidaID, username, false);  //registra el voto del jugador para pausar la partida
      
      if (estado.action === 'voto_pausa_registrado') {
        socket.to(data.partidaID).emit('voto_pausa_registrado', {
          partidaID: data.partidaID,
          jugador: username,
          votosActuales: estado.votosActuales
        });
      }

      if (estado.action === 'pausada') {
        io.to(data.partidaID).emit('partida_pausada', { partidaID: data.partidaID })   //envia un mensaje al resto de usuarios de la partida para indicar que la partida se ha pausado
      }
    })

    socket.on("jugador_solicita_pausa", async(data) => {
      //un jugador solicita  pausar la partida, se envia un mensaje a todos los jugadores de la partida (excepto el, que ya cuenta que ha votado) indicando que un jugador ha votado para pausar la partida para preguntar si solicita pausarla
      
      const estado = await gameService.votarPausa(data.partidaID, username, true);  //registra el voto del jugador para pausar la partida
      
      socket.to(data.partidaID).emit('voto_pausa', {jugador: username, partidaID: data.partidaID})   //envia un mensaje al resto de usuarios de la partida para preguntar si quieren pausar la partida
      
      if (estado.action === 'pausada') {
        io.to(data.partidaID).emit('partida_pausada', { partidaID: data.partidaID })   //envia un mensaje al resto de usuarios de la partida para indicar que la partida se ha pausado
      }

    })


    socket.on("jugador_solicita_reanudar", async(data) => {
      //un jugador inicializa votacion para solicitar reanudar la partida, se envia un mensaje a todos los jugadores de la partida (excepto el, que ya cuenta que ha votado) para que voten
      const estado = await gameService.reanudarPartida(data.partidaID, username);  //registra el voto del jugador para reanudar la partida
      
      socket.to(data.partidaID).emit('voto_reanudar', {jugador: username})   //envia un mensaje al resto de usuarios de la partida para preguntar si quieren reanudar la partida
      if (estado.action === 'reanudada') {
        io.to(data.partidaID).emit('partida_reanudada', { partidaID: data.partidaID })   //envia un mensaje al resto de usuarios de la partida para indicar que la partida se ha reanudado
      }

    })

    socket.on("jugador_voto_reanudar", async(data) => {
      //un jugador vota para reanudar la partida, en una votacion ya iniciada por otro jugador
      const estado = await gameService.reanudarPartida(data.partidaID, username);  //registra el voto del jugador para reanudar la partida
      if (estado.action === 'voto_reanudar_registrado') {
        socket.to(data.partidaID).emit('voto_reanudar_registrado', {
          partidaID: data.partidaID,
          jugador: username,
          votosActuales: estado.votosActuales
        });
      }
      if (estado.action === 'reanudada') {
        io.to(data.partidaID).emit('partida_reanudada', { partidaID: data.partidaID })   //envia un mensaje al resto de usuarios de la partida para indicar que la partida se ha reanudado
      }
    })

    socket.on("unir_bot", async(data) => {
      //añadir un bot a la partida, solo el creador de la partida puede añadir bots, y solo se pueden añadir bots antes de iniciar la partida
      try {
        await gameService.añadirBot(data.partidaID, username) //añadir un bot a la partida
        io.to(data.partidaID).emit('bot_unido', {partidaID: data.partidaID, mensaje: `Se ha unido un bot a la partida por el usuario ${username}`})   //envia un mensaje a todos los jugadores de la partida para indicar que se ha unido un bot
      
      } catch (error) {
        socket.emit('error_unir_bot', {partidaID: data.partidaID, message: error.message}) //enviar mensaje al jugador que ha intentado añadir el bot con el error
        return;
      }
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
