
    const schema = {
  "asyncapi": "3.1.0",
  "id": "urn:com:notuno:websocket",
  "info": {
    "title": "Notuno Web Events Socket",
    "version": "1.0.0"
  },
  "defaultContentType": "application/json",
  "servers": {
    "dev": {
      "host": "ws://localhost:3000",
      "protocol": "ws"
    }
  },
  "channels": {
    "nuevoMensajeChat": {
      "address": "chat.nuevoMensajeChat",
      "parameters": {},
      "messages": {
        "nuevoMensajeChat": {
          "name": "nuevoMensajeChat",
          "title": "Nuevo mensaje chat",
          "summary": "Emite el mensaje filtrado a todos los usuarios de la sala donde se encuentra el emisor del mensaje",
          "payload": {
            "type": "object",
            "properties": {
              "mensaje": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-2>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-1>"
          },
          "x-parser-unique-object-id": "nuevoMensajeChat"
        }
      },
      "x-parser-unique-object-id": "nuevoMensajeChat"
    },
    "newMessage": {
      "address": "chat.newMessage",
      "parameters": {},
      "messages": {
        "newMessage": {
          "name": "newMessage",
          "title": "New Message",
          "summary": "Recibir mensaje de un usuario, lo envia para verificar y reenviar a toda la sala",
          "payload": {
            "type": "object",
            "properties": {
              "mensaje": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-4>"
              },
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-5>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-3>"
          },
          "x-parser-unique-object-id": "newMessage"
        }
      },
      "x-parser-unique-object-id": "newMessage"
    },
    "pendingFriendRequests": {
      "address": "friends.pendingFriendRequests",
      "parameters": {},
      "messages": {
        "pendingFriendRequests": {
          "name": "pendingFriendRequests",
          "title": "Pending Friend Requests",
          "summary": "Recibir peticion de solicitudes de amistad pendientes",
          "x-parser-unique-object-id": "pendingFriendRequests"
        }
      },
      "x-parser-unique-object-id": "pendingFriendRequests"
    },
    "res_pendingFriendRequests": {
      "address": "friends.res_pendingFriendRequests",
      "parameters": {},
      "messages": {
        "res_pendingFriendRequests": {
          "name": "res_pendingFriendRequests",
          "title": "Res Pending Friend Requests",
          "summary": "Lista de solicitudes de amistad pendientes de contestar",
          "payload": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id_usuario_origen": {
                  "type": "string",
                  "x-parser-schema-id": "<anonymous-schema-8>"
                },
                "id_usuario_destino": {
                  "type": "string",
                  "x-parser-schema-id": "<anonymous-schema-9>"
                },
                "estado": {
                  "type": "string",
                  "x-parser-schema-id": "<anonymous-schema-10>"
                }
              },
              "x-parser-schema-id": "<anonymous-schema-7>"
            },
            "x-parser-schema-id": "<anonymous-schema-6>"
          },
          "x-parser-unique-object-id": "res_pendingFriendRequests"
        }
      },
      "x-parser-unique-object-id": "res_pendingFriendRequests"
    },
    "newFriendRequest": {
      "address": "friends.newFriendRequest",
      "parameters": {},
      "messages": {
        "newFriendRequest": {
          "name": "newFriendRequest",
          "title": "New Friend Request",
          "summary": "Recibir notificacion de que se ha enviado una solicitud de amistad",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-11>"
          },
          "x-parser-unique-object-id": "newFriendRequest"
        }
      },
      "x-parser-unique-object-id": "newFriendRequest"
    },
    "mostrarFriendRequest": {
      "address": "friends.mostrarFriendRequest",
      "parameters": {},
      "messages": {
        "mostrarFriendRequest": {
          "name": "mostrarFriendRequest",
          "title": "Mostrar Friend Request",
          "summary": "Notificacion de solicitud de amistad enviada",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-12>"
          },
          "x-parser-unique-object-id": "mostrarFriendRequest"
        }
      },
      "x-parser-unique-object-id": "mostrarFriendRequest"
    },
    "newFriendRequestAccepted": {
      "address": "friends.newFriendRequestAccepted",
      "parameters": {},
      "messages": {
        "newFriendRequestAccepted": {
          "name": "newFriendRequestAccepted",
          "title": "New Friend Request Accepted",
          "summary": "Recibir notificacion de que se ha aceptado una solicitud de amistad",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-13>"
          },
          "x-parser-unique-object-id": "newFriendRequestAccepted"
        }
      },
      "x-parser-unique-object-id": "newFriendRequestAccepted"
    },
    "mostrarAceptadaFriendRequest": {
      "address": "friends.mostrarAceptadaFriendRequest",
      "parameters": {},
      "messages": {
        "mostrarAceptadaFriendRequest": {
          "name": "mostrarAceptadaFriendRequest",
          "title": "Mostrar Aceptada Friend Request",
          "summary": "Notificacion al cliente de solicitud aceptada",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-14>"
          },
          "x-parser-unique-object-id": "mostrarAceptadaFriendRequest"
        }
      },
      "x-parser-unique-object-id": "mostrarAceptadaFriendRequest"
    },
    "newFriendRequestReject": {
      "address": "friends.newFriendRequestReject",
      "parameters": {},
      "messages": {
        "newFriendRequestReject": {
          "name": "newFriendRequestReject",
          "title": "New Friend Request Reject",
          "summary": "Recibe notificacion de rechazo de solicitud de amistad",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-15>"
          },
          "x-parser-unique-object-id": "newFriendRequestReject"
        }
      },
      "x-parser-unique-object-id": "newFriendRequestReject"
    },
    "mostrarRechazadaFriendRequest": {
      "address": "friends.mostrarRechazadaFriendRequest",
      "parameters": {},
      "messages": {
        "mostrarRechazadaFriendRequest": {
          "name": "mostrarRechazadaFriendRequest",
          "title": "Mostrar Rechazada Friend Request",
          "summary": "Notificacion al cliente de solicitud rechazada",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-16>"
          },
          "x-parser-unique-object-id": "mostrarRechazadaFriendRequest"
        }
      },
      "x-parser-unique-object-id": "mostrarRechazadaFriendRequest"
    },
    "avisarAmigosConectados_UserOnline": {
      "address": "friends.avisarAmigosConectados_UserOnline",
      "parameters": {},
      "messages": {
        "avisarAmigosConectados_UserOnline": {
          "name": "avisarAmigosConectados_UserOnline",
          "title": "Avisar Amigos Conectados User Online",
          "summary": "Notificacion de que un amigo se ha conectado",
          "x-parser-unique-object-id": "avisarAmigosConectados_UserOnline"
        }
      },
      "x-parser-unique-object-id": "avisarAmigosConectados_UserOnline"
    },
    "amigoConectado": {
      "address": "friends.amigoConectado",
      "parameters": {},
      "messages": {
        "amigoConectado": {
          "name": "amigoConectado",
          "title": "Amigo Conectado",
          "summary": "Notifica al cliente que un amigo se ha conectado",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-17>"
          },
          "x-parser-unique-object-id": "amigoConectado"
        }
      },
      "x-parser-unique-object-id": "amigoConectado"
    },
    "avisarAmigosConectados_UserDisconnect": {
      "address": "notuno.friends.avisarAmigosConectados_UserDisconnect",
      "parameters": {},
      "messages": {
        "avisarAmigosConectados_UserDisconnect": {
          "name": "avisarAmigosConectados_UserDisconnect",
          "title": "Avisar Amigos Conectados User Disconnect",
          "summary": "Notificacion de que un amigo se ha desconectado",
          "x-parser-unique-object-id": "avisarAmigosConectados_UserDisconnect"
        }
      },
      "x-parser-unique-object-id": "avisarAmigosConectados_UserDisconnect"
    },
    "amigoDesconectado": {
      "address": "friends.amigoDesconectado",
      "parameters": {},
      "messages": {
        "amigoDesconectado": {
          "name": "amigoDesconectado",
          "title": "Amigo Desconectado",
          "summary": "Notifica al cliente que un amigo se ha desconectado",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-18>"
          },
          "x-parser-unique-object-id": "amigoDesconectado"
        }
      },
      "x-parser-unique-object-id": "amigoDesconectado"
    }
  },
  "operations": {
    "nuevoMensajeChat": {
      "action": "send",
      "channel": "$ref:$.channels.nuevoMensajeChat",
      "x-parser-unique-object-id": "nuevoMensajeChat"
    },
    "newMessage": {
      "action": "receive",
      "channel": "$ref:$.channels.newMessage",
      "x-parser-unique-object-id": "newMessage"
    },
    "pendingFriendRequests": {
      "action": "receive",
      "channel": "$ref:$.channels.pendingFriendRequests",
      "x-parser-unique-object-id": "pendingFriendRequests"
    },
    "res_pendingFriendRequests": {
      "action": "send",
      "channel": "$ref:$.channels.res_pendingFriendRequests",
      "x-parser-unique-object-id": "res_pendingFriendRequests"
    },
    "newFriendRequest": {
      "action": "receive",
      "channel": "$ref:$.channels.newFriendRequest",
      "x-parser-unique-object-id": "newFriendRequest"
    },
    "mostrarFriendRequest": {
      "action": "send",
      "channel": "$ref:$.channels.mostrarFriendRequest",
      "x-parser-unique-object-id": "mostrarFriendRequest"
    },
    "newFriendRequestAccepted": {
      "action": "receive",
      "channel": "$ref:$.channels.newFriendRequestAccepted",
      "x-parser-unique-object-id": "newFriendRequestAccepted"
    },
    "mostrarAceptadaFriendRequest": {
      "action": "send",
      "channel": "$ref:$.channels.mostrarAceptadaFriendRequest",
      "x-parser-unique-object-id": "mostrarAceptadaFriendRequest"
    },
    "newFriendRequestReject": {
      "action": "receive",
      "channel": "$ref:$.channels.newFriendRequestReject",
      "x-parser-unique-object-id": "newFriendRequestReject"
    },
    "mostrarRechazadaFriendRequest": {
      "action": "send",
      "channel": "$ref:$.channels.mostrarRechazadaFriendRequest",
      "x-parser-unique-object-id": "mostrarRechazadaFriendRequest"
    },
    "avisarAmigosConectados_UserOnline": {
      "action": "receive",
      "channel": "$ref:$.channels.avisarAmigosConectados_UserOnline",
      "x-parser-unique-object-id": "avisarAmigosConectados_UserOnline"
    },
    "amigoConectado": {
      "action": "send",
      "channel": "$ref:$.channels.amigoConectado",
      "x-parser-unique-object-id": "amigoConectado"
    },
    "avisarAmigosConectados_UserDisconnect": {
      "action": "receive",
      "channel": "$ref:$.channels.avisarAmigosConectados_UserDisconnect",
      "x-parser-unique-object-id": "avisarAmigosConectados_UserDisconnect"
    },
    "amigoDesconectado": {
      "action": "send",
      "channel": "$ref:$.channels.amigoDesconectado",
      "x-parser-unique-object-id": "amigoDesconectado"
    }
  },
  "components": {
    "messages": {
      "nuevoMensajeChat": "$ref:$.channels.nuevoMensajeChat.messages.nuevoMensajeChat",
      "newMessage": "$ref:$.channels.newMessage.messages.newMessage",
      "pendingFriendRequests": "$ref:$.channels.pendingFriendRequests.messages.pendingFriendRequests",
      "res_pendingFriendRequests": "$ref:$.channels.res_pendingFriendRequests.messages.res_pendingFriendRequests",
      "newFriendRequest": "$ref:$.channels.newFriendRequest.messages.newFriendRequest",
      "mostrarFriendRequest": "$ref:$.channels.mostrarFriendRequest.messages.mostrarFriendRequest",
      "newFriendRequestAccepted": "$ref:$.channels.newFriendRequestAccepted.messages.newFriendRequestAccepted",
      "mostrarAceptadaFriendRequest": "$ref:$.channels.mostrarAceptadaFriendRequest.messages.mostrarAceptadaFriendRequest",
      "newFriendRequestReject": "$ref:$.channels.newFriendRequestReject.messages.newFriendRequestReject",
      "mostrarRechazadaFriendRequest": "$ref:$.channels.mostrarRechazadaFriendRequest.messages.mostrarRechazadaFriendRequest",
      "avisarAmigosConectados_UserOnline": "$ref:$.channels.avisarAmigosConectados_UserOnline.messages.avisarAmigosConectados_UserOnline",
      "amigoConectado": "$ref:$.channels.amigoConectado.messages.amigoConectado",
      "avisarAmigosConectados_UserDisconnect": "$ref:$.channels.avisarAmigosConectados_UserDisconnect.messages.avisarAmigosConectados_UserDisconnect",
      "amigoDesconectado": "$ref:$.channels.amigoDesconectado.messages.amigoDesconectado"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  