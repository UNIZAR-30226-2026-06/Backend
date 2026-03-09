const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testCrearPartida() {
  try {

    // 1️⃣ LOGIN
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      nombre_usuario: "gonzalo",
      password: "1234"
    });

    const token = loginResponse.data.token;

    console.log("Token obtenido correctamente:");
    console.log(token);
    console.log("------------");

    // 2️⃣ Configuración de partida
    const configPartida = {
      numCartasInicio: 7,
      modoCartasEspeciales: true,
      modoRoles: false,
      maxJugadores: 4,
      timeoutTurno: 30,
      partidaPublica: true,
      sonido: true,
      musica: true,
      vibracion: true
    };

    // 3️⃣ Crear partida
    const partidaResponse = await axios.post(
      `${API_URL}/partidas`,
      configPartida,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Partida creada correctamente:");
    console.log(partidaResponse.data);

  } catch (error) {

    if (error.response) {
      console.error("Error del servidor:");
      console.error(error.response.data);
    } else {
      console.error("Error:", error.message);
    }

  }
}

testCrearPartida();