
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
    },
    "start_game": {
      "address": "game.start_game",
      "parameters": {},
      "messages": {
        "start_game": {
          "name": "start_game",
          "title": "Start Game",
          "summary": "Crear e iniciar partida en el servidor,",
          "payload": {
            "type": "object",
            "properties": {
              "jugadores": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-20>"
              },
              "configuracion": {
                "type": "object",
                "properties": {
                  "partidaID": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-22>"
                  }
                },
                "x-parser-schema-id": "<anonymous-schema-21>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-19>"
          },
          "x-parser-unique-object-id": "start_game"
        }
      },
      "x-parser-unique-object-id": "start_game"
    },
    "partida_iniciada": {
      "address": "game.partida_iniciada",
      "parameters": {},
      "messages": {
        "partida_iniciada": {
          "name": "partida_iniciada",
          "title": "Partida Iniciada",
          "summary": "se le indica a todos los jugadores de la partida que la partida ha comenzado y se les envia el mazo inicial",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-24>"
              },
              "modoJuego": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-25>"
              },
              "manoInicial": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id_carta": {
                      "type": "integer",
                      "x-parser-schema-id": "<anonymous-schema-28>"
                    },
                    "tipo_carta": {
                      "type": "string",
                      "x-parser-schema-id": "<anonymous-schema-29>"
                    },
                    "color": {
                      "type": "string",
                      "x-parser-schema-id": "<anonymous-schema-30>"
                    },
                    "numero": {
                      "type": "integer",
                      "x-parser-schema-id": "<anonymous-schema-31>"
                    },
                    "codigo": {
                      "type": "string",
                      "x-parser-schema-id": "<anonymous-schema-32>"
                    },
                    "id_estilo": {
                      "type": "integer",
                      "x-parser-schema-id": "<anonymous-schema-33>"
                    }
                  },
                  "x-parser-schema-id": "<anonymous-schema-27>"
                },
                "x-parser-schema-id": "<anonymous-schema-26>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-23>"
          },
          "x-parser-unique-object-id": "partida_iniciada"
        }
      },
      "x-parser-unique-object-id": "partida_iniciada"
    },
    "comprobar_turno": {
      "address": "game.comprobar_turno",
      "parameters": {},
      "messages": {
        "comprobar_turno": {
          "name": "comprobar_turno",
          "title": "Comprobar Turno",
          "summary": "El jugador que ha jugado el turno emite este evento para comprobar si el turno es valido",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-35>"
              },
              "cartaId": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-36>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-34>"
          },
          "x-parser-unique-object-id": "comprobar_turno"
        }
      },
      "x-parser-unique-object-id": "comprobar_turno"
    },
    "turno_invalido": {
      "address": "game.turno_invalido",
      "parameters": {},
      "messages": {
        "turno_invalido": {
          "name": "turno_invalido",
          "title": "Turno Invalido",
          "summary": "Se le indica al jugador que ha jugado el turno que el turno no es valido, con un mensaje de error",
          "payload": {
            "type": "object",
            "properties": {
              "message": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-38>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-37>"
          },
          "x-parser-unique-object-id": "turno_invalido"
        }
      },
      "x-parser-unique-object-id": "turno_invalido"
    },
    "turno_siguiente": {
      "address": "game.turno_siguiente",
      "parameters": {},
      "messages": {
        "turno_siguiente": {
          "name": "turno_siguiente",
          "title": "Turno Siguiente",
          "summary": "Se le indica a todos los jugadores de la partida quien es el siguiente jugador y si tiene que robar cartas o no",
          "payload": {
            "type": "object",
            "properties": {
              "siguienteJugador": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-40>"
              },
              "cartasRobar": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-41>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-39>"
          },
          "x-parser-unique-object-id": "turno_siguiente"
        }
      },
      "x-parser-unique-object-id": "turno_siguiente"
    },
    "robar_carta": {
      "address": "game.robar_carta",
      "parameters": {},
      "messages": {
        "robar_carta": {
          "name": "robar_carta",
          "title": "Robar Carta",
          "summary": "El jugador que tiene que robar una carta emite este evento para robar la carta",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-43>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-42>"
          },
          "x-parser-unique-object-id": "robar_carta"
        }
      },
      "x-parser-unique-object-id": "robar_carta"
    },
    "carta_robada": {
      "address": "game.carta_robada",
      "parameters": {},
      "messages": {
        "carta_robada": {
          "name": "carta_robada",
          "title": "Carta Robada",
          "summary": "Se le envia al jugador que ha robado la carta la carta robada",
          "payload": {
            "type": "object",
            "properties": {
              "carta": {
                "type": "object",
                "properties": {
                  "id_carta": {
                    "type": "integer",
                    "x-parser-schema-id": "<anonymous-schema-46>"
                  },
                  "tipo_carta": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-47>"
                  },
                  "color": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-48>"
                  },
                  "numero": {
                    "type": "integer",
                    "x-parser-schema-id": "<anonymous-schema-49>"
                  },
                  "codigo": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-50>"
                  },
                  "id_estilo": {
                    "type": "integer",
                    "x-parser-schema-id": "<anonymous-schema-51>"
                  }
                },
                "x-parser-schema-id": "<anonymous-schema-45>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-44>"
          },
          "x-parser-unique-object-id": "carta_robada"
        }
      },
      "x-parser-unique-object-id": "carta_robada"
    },
    "unirse_partida": {
      "address": "game.unirse_partida",
      "parameters": {},
      "messages": {
        "unirse_partida": {
          "name": "unirse_partida",
          "title": "Unirse partida",
          "summary": "El jugador que quiere unirse a una partida emite este evento para unirse a la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-53>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-52>"
          },
          "x-parser-unique-object-id": "unirse_partida"
        }
      },
      "x-parser-unique-object-id": "unirse_partida"
    },
    "nuevo_jugador": {
      "address": "game.nuevo_jugador",
      "parameters": {},
      "messages": {
        "nuevo_jugador": {
          "name": "nuevo_jugador",
          "title": "Nuevo Jugador",
          "summary": "Se le indica a todos los jugadores de la partida que un nuevo jugador se ha unido a la partida (indica el nombre de usuario del jugador que se ha unido)",
          "payload": {
            "type": "string",
            "x-parser-schema-id": "<anonymous-schema-54>"
          },
          "x-parser-unique-object-id": "nuevo_jugador"
        }
      },
      "x-parser-unique-object-id": "nuevo_jugador"
    },
    "jugador_voto_pausa": {
      "address": "game.jugador_voto_pausa",
      "parameters": {},
      "messages": {
        "jugador_voto_pausa": {
          "name": "jugador_voto_pausa",
          "title": "Jugador Voto Pausa",
          "summary": "Un jugador vota para pausar la partida, en una votacion ya iniciada por otro jugador",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-56>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-55>"
          },
          "x-parser-unique-object-id": "jugador_voto_pausa"
        }
      },
      "x-parser-unique-object-id": "jugador_voto_pausa"
    },
    "partida_pausada": {
      "address": "game.partida_pausada",
      "parameters": {},
      "messages": {
        "partida_pausada": {
          "name": "partida_pausada",
          "title": "Partida Pausada",
          "summary": "Se le indica a todos los jugadores de la partida que la partida se ha pausado",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-58>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-57>"
          },
          "x-parser-unique-object-id": "partida_pausada"
        }
      },
      "x-parser-unique-object-id": "partida_pausada"
    },
    "jugador_solicita_pausa": {
      "address": "game.jugador_solicita_pausa",
      "parameters": {},
      "messages": {
        "jugador_solicita_pausa": {
          "name": "jugador_solicita_pausa",
          "title": "Jugador Solicita Pausa",
          "summary": "Un jugador solicita pausar la partida, se le envia a los demas jugadores de la partida para preguntar si quieren pausar la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-60>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-59>"
          },
          "x-parser-unique-object-id": "jugador_solicita_pausa"
        }
      },
      "x-parser-unique-object-id": "jugador_solicita_pausa"
    },
    "voto_pausa": {
      "address": "game.voto_pausa",
      "parameters": {},
      "messages": {
        "voto_pausa": {
          "name": "voto_pausa",
          "title": "Voto Pausa",
          "summary": "Se solicita a los jugadores de la partida (excepto el que inició la votación) que voten para pausar la partida debido a que un jugador ha iniciado la votación",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-62>"
              },
              "jugador": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-63>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-61>"
          },
          "x-parser-unique-object-id": "voto_pausa"
        }
      },
      "x-parser-unique-object-id": "voto_pausa"
    },
    "jugador_solicita_reanudar": {
      "address": "game.jugador_solicita_reanudar",
      "parameters": {},
      "messages": {
        "jugador_solicita_reanudar": {
          "name": "jugador_solicita_reanudar",
          "title": "Jugador Solicita Reanudar",
          "summary": "Un jugador solicita reanudar la partida, se le envia a los demas jugadores de la partida para preguntar si quieren reanudar la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-65>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-64>"
          },
          "x-parser-unique-object-id": "jugador_solicita_reanudar"
        }
      },
      "x-parser-unique-object-id": "jugador_solicita_reanudar"
    },
    "voto_reanudar": {
      "address": "game.voto_reanudar",
      "parameters": {},
      "messages": {
        "voto_reanudar": {
          "name": "voto_reanudar",
          "title": "Voto Reanudar",
          "summary": "Se solicita a los jugadores de la partida (excepto el que inició la votación) que voten para reanudar la partida debido a que un jugador ha iniciado la votación",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-67>"
              },
              "jugador": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-68>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-66>"
          },
          "x-parser-unique-object-id": "voto_reanudar"
        }
      },
      "x-parser-unique-object-id": "voto_reanudar"
    },
    "partida_reanudada": {
      "address": "game.partida_reanudada",
      "parameters": {},
      "messages": {
        "partida_reanudada": {
          "name": "partida_reanudada",
          "title": "Partida Reanudada",
          "summary": "Se le indica a todos los jugadores de la partida que la partida se ha reanudado",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-70>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-69>"
          },
          "x-parser-unique-object-id": "partida_reanudada"
        }
      },
      "x-parser-unique-object-id": "partida_reanudada"
    },
    "jugador_voto_reanudar": {
      "address": "game.jugador_voto_reanudar",
      "parameters": {},
      "messages": {
        "jugador_voto_reanudar": {
          "name": "jugador_voto_reanudar",
          "title": "Jugador Voto Reanudar",
          "summary": "Un jugador vota para reanudar la partida, en una votacion ya iniciada por otro jugador",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-72>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-71>"
          },
          "x-parser-unique-object-id": "jugador_voto_reanudar"
        }
      },
      "x-parser-unique-object-id": "jugador_voto_reanudar"
    },
    "unir_bot": {
      "address": "game.unir_bot",
      "parameters": {},
      "messages": {
        "unir_bot": {
          "name": "unir_bot",
          "title": "Unir Bot",
          "summary": "Un jugador añade un bot a la partida, solo el creador de la partida puede añadir bots, y solo se pueden añadir bots antes de iniciar la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-74>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-73>"
          },
          "x-parser-unique-object-id": "unir_bot"
        }
      },
      "x-parser-unique-object-id": "unir_bot"
    },
    "bot_unido": {
      "address": "game.bot_unido",
      "parameters": {},
      "messages": {
        "bot_unido": {
          "name": "bot_unido",
          "title": "Bot Unido",
          "summary": "Se le indica a todos los jugadores de la partida que un bot se ha unido a la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-76>"
              },
              "mensaje": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-77>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-75>"
          },
          "x-parser-unique-object-id": "bot_unido"
        }
      },
      "x-parser-unique-object-id": "bot_unido"
    },
    "error_unir_bot": {
      "address": "game.error_unir_bot",
      "parameters": {},
      "messages": {
        "error_unir_bot": {
          "name": "error_unir_bot",
          "title": "Error Unir Bot",
          "summary": "Se le indica a un jugador que ha ocurrido un error al intentar unir un bot a la partida",
          "payload": {
            "type": "object",
            "properties": {
              "partidaID": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-79>"
              },
              "mensaje": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-80>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-78>"
          },
          "x-parser-unique-object-id": "error_unir_bot"
        }
      },
      "x-parser-unique-object-id": "error_unir_bot"
    },
    "disconnect": {
      "address": "disconnect",
      "parameters": {},
      "messages": {
        "disconnect": {
          "name": "disconnect",
          "title": "Disconnect",
          "summary": "Un cliente notifica que se ha desconectado al servidor, para eliminarlo de la lista de usuarios conectados",
          "x-parser-unique-object-id": "disconnect"
        }
      },
      "x-parser-unique-object-id": "disconnect"
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
    },
    "start_game": {
      "action": "receive",
      "channel": "$ref:$.channels.start_game",
      "x-parser-unique-object-id": "start_game"
    },
    "partida_iniciada": {
      "action": "send",
      "channel": "$ref:$.channels.partida_iniciada",
      "x-parser-unique-object-id": "partida_iniciada"
    },
    "comprobar_turno": {
      "action": "receive",
      "channel": "$ref:$.channels.comprobar_turno",
      "x-parser-unique-object-id": "comprobar_turno"
    },
    "turno_invalido": {
      "action": "send",
      "channel": "$ref:$.channels.turno_invalido",
      "x-parser-unique-object-id": "turno_invalido"
    },
    "turno_siguiente": {
      "action": "send",
      "channel": "$ref:$.channels.turno_siguiente",
      "x-parser-unique-object-id": "turno_siguiente"
    },
    "robar_carta": {
      "action": "receive",
      "channel": "$ref:$.channels.robar_carta",
      "x-parser-unique-object-id": "robar_carta"
    },
    "carta_robada": {
      "action": "send",
      "channel": "$ref:$.channels.carta_robada",
      "x-parser-unique-object-id": "carta_robada"
    },
    "unirse_partida": {
      "action": "receive",
      "channel": "$ref:$.channels.unirse_partida",
      "x-parser-unique-object-id": "unirse_partida"
    },
    "nuevo_jugador": {
      "action": "receive",
      "channel": "$ref:$.channels.nuevo_jugador",
      "x-parser-unique-object-id": "nuevo_jugador"
    },
    "jugador_voto_pausa": {
      "action": "receive",
      "channel": "$ref:$.channels.jugador_voto_pausa",
      "x-parser-unique-object-id": "jugador_voto_pausa"
    },
    "partida_pausada": {
      "action": "send",
      "channel": "$ref:$.channels.partida_pausada",
      "x-parser-unique-object-id": "partida_pausada"
    },
    "jugador_solicita_pausa": {
      "action": "receive",
      "channel": "$ref:$.channels.jugador_solicita_pausa",
      "x-parser-unique-object-id": "jugador_solicita_pausa"
    },
    "voto_pausa": {
      "action": "send",
      "channel": "$ref:$.channels.voto_pausa",
      "x-parser-unique-object-id": "voto_pausa"
    },
    "jugador_solicita_reanudar": {
      "action": "receive",
      "channel": "$ref:$.channels.jugador_solicita_reanudar",
      "x-parser-unique-object-id": "jugador_solicita_reanudar"
    },
    "voto_reanudar": {
      "action": "send",
      "channel": "$ref:$.channels.voto_reanudar",
      "x-parser-unique-object-id": "voto_reanudar"
    },
    "partida_reanudada": {
      "action": "send",
      "channel": "$ref:$.channels.partida_reanudada",
      "x-parser-unique-object-id": "partida_reanudada"
    },
    "jugador_voto_reanudar": {
      "action": "receive",
      "channel": "$ref:$.channels.jugador_voto_reanudar",
      "x-parser-unique-object-id": "jugador_voto_reanudar"
    },
    "unir_bot": {
      "action": "receive",
      "channel": "$ref:$.channels.unir_bot",
      "x-parser-unique-object-id": "unir_bot"
    },
    "bot_unido": {
      "action": "send",
      "channel": "$ref:$.channels.bot_unido",
      "x-parser-unique-object-id": "bot_unido"
    },
    "error_unir_bot": {
      "action": "send",
      "channel": "$ref:$.channels.error_unir_bot",
      "x-parser-unique-object-id": "error_unir_bot"
    },
    "disconnect": {
      "action": "receive",
      "channel": "$ref:$.channels.disconnect",
      "x-parser-unique-object-id": "disconnect"
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
      "amigoDesconectado": "$ref:$.channels.amigoDesconectado.messages.amigoDesconectado",
      "start_game": "$ref:$.channels.start_game.messages.start_game",
      "partida_iniciada": "$ref:$.channels.partida_iniciada.messages.partida_iniciada",
      "comprobar_turno": "$ref:$.channels.comprobar_turno.messages.comprobar_turno",
      "turno_invalido": "$ref:$.channels.turno_invalido.messages.turno_invalido",
      "turno_siguiente": "$ref:$.channels.turno_siguiente.messages.turno_siguiente",
      "robar_carta": "$ref:$.channels.robar_carta.messages.robar_carta",
      "carta_robada": "$ref:$.channels.carta_robada.messages.carta_robada",
      "unirse_partida": "$ref:$.channels.unirse_partida.messages.unirse_partida",
      "nuevo_jugador": "$ref:$.channels.nuevo_jugador.messages.nuevo_jugador",
      "jugador_voto_pausa": "$ref:$.channels.jugador_voto_pausa.messages.jugador_voto_pausa",
      "partida_pausada": "$ref:$.channels.partida_pausada.messages.partida_pausada",
      "jugador_solicita_pausa": "$ref:$.channels.jugador_solicita_pausa.messages.jugador_solicita_pausa",
      "voto_pausa": "$ref:$.channels.voto_pausa.messages.voto_pausa",
      "jugador_solicita_reanudar": "$ref:$.channels.jugador_solicita_reanudar.messages.jugador_solicita_reanudar",
      "voto_reanudar": "$ref:$.channels.voto_reanudar.messages.voto_reanudar",
      "partida_reanudada": "$ref:$.channels.partida_reanudada.messages.partida_reanudada",
      "jugador_voto_reanudar": "$ref:$.channels.jugador_voto_reanudar.messages.jugador_voto_reanudar",
      "unir_bot": "$ref:$.channels.unir_bot.messages.unir_bot",
      "bot_unido": "$ref:$.channels.bot_unido.messages.bot_unido",
      "error_unir_bot": "$ref:$.channels.error_unir_bot.messages.error_unir_bot",
      "disconnect": "$ref:$.channels.disconnect.messages.disconnect"
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
  