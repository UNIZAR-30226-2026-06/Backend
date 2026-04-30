const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testFlujoCompleto() {
  try {
    // Generamos un sufijo aleatorio para que el usuario sea único en cada prueba
    const timestamp = Date.now();
    const testUsername = `testuser_${timestamp}`;
    const testEmail = `testuser_${timestamp}@correo.com`;
    const testPassword = "1234";

    console.log(`[1] REGISTRANDO USUARIO NUEVO: ${testUsername}...`);
    // OJO: Asegúrate de que esta ruta coincida con tu endpoint real de registro
    await axios.post(`${API_URL}/auth/register`, {
      nombre_usuario: testUsername,
      correo: testEmail,
      password: testPassword
    });
    console.log("✅ Usuario registrado con éxito.\n");


    console.log(`[2] HACIENDO LOGIN...`);
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      nombre_usuario: testUsername,
      password: testPassword
    });
    const token = loginResponse.data.token;
    console.log("✅ Token obtenido.\n");


    console.log(`[3] CREANDO PARTIDA...`);
    const configPartida = {
      numCartasInicio: 7,
      modoCartasEspeciales: true,
      modoRoles: false,
      maxJugadores: 4,
      timeoutTurno: 30,
      sonido: true,
      musica: true,
      vibracion: true,
      privada: true // Ponemos privada para que no se meta nadie aleatorio
    };

    const partidaResponse = await axios.post(
      `${API_URL}/partidas`,
      configPartida,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Según tu controlador, devuelve { gameId, codigo }
    const gameId = partidaResponse.data.gameId; 
    console.log(`✅ Partida creada con ID: ${gameId}\n`);


    console.log(`[4] OBTENIENDO INFO DE LA PARTIDA...`);
    // Al crear la partida, el backend ya te inscribe automáticamente,
    // así que consultamos el lobby para verificar que estás dentro.
    const partidaInfo = await axios.get(
      `${API_URL}/partidas/${gameId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Info recibida:");
    console.log(`   - Estado: ${partidaInfo.data.estado}`);
    console.log(`   - Jugadores dentro: ${partidaInfo.data.jugadores.join(', ')}\n`);


    console.log(`[5] BORRANDO LA PARTIDA...`);
    const deleteResponse = await axios.delete(
      `${API_URL}/partidas/${gameId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Respuesta del servidor al borrar:");
    console.log(deleteResponse.data);
    console.log("\n🚀 TEST COMPLETADO CON ÉXITO.");

  } catch (error) {
    if (error.response) {
      console.error("❌ Error del servidor (Status " + error.response.status + "):");
      console.error(error.response.data);
    } else {
      console.error("❌ Error de red o código:", error.message);
    }
  }
}

testFlujoCompleto();