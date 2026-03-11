const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testPartidaFlow() {

  try {

    console.log("LOGIN...");
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      nombre_usuario: "gonzalo",
      password: "1234"
    });

    const token = loginResponse.data.token;

    console.log("Token obtenido:");
    console.log(token);
    console.log("------------");


    console.log("CREANDO PARTIDA...");

    const configPartida = {
      numCartasInicio: 7,
      modoCartasEspeciales: true,
      modoRoles: false,
      maxJugadores: 4,
      timeoutTurno: 30,
      sonido: true,
      musica: true,
      vibracion: true
    };

    const partidaResponse = await axios.post(
      `${API_URL}/partidas`,
      configPartida,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const gameId = partidaResponse.data.id_partida;

    console.log("Partida creada:");
    console.log(gameId);
    console.log("------------");


    console.log("UNIENDO JUGADOR A PARTIDA...");

    const joinResponse = await axios.post(
      `${API_URL}/partidas/${gameId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Jugador unido:");
    console.log(joinResponse.data);
    console.log("------------");


    console.log("OBTENIENDO INFO PARTIDA...");

    const partidaInfo = await axios.get(
      `${API_URL}/partidas/${gameId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Info partida:");
    console.log(partidaInfo.data);
    console.log("------------");


    console.log("OBTENIENDO ESTADO PARTIDA...");

    const estado = await axios.get(
      `${API_URL}/partidas/${gameId}/state`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Estado partida:");
    console.log(estado.data);
    console.log("------------");


    console.log("EMPEZANDO PARTIDA...");

    const startResponse = await axios.post(
      `${API_URL}/partidas/${gameId}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Partida iniciada:");
    console.log(startResponse.data);
    console.log("------------");


  } catch (error) {

    if (error.response) {
      console.error("Error del servidor:");
      console.error(error.response.data);
    } else {
      console.error("Error:", error.message);
    }

  }

}

testPartidaFlow();