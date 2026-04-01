const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
const TEST_USER = process.env.TEST_USER || 'gonzalo';
const TEST_PASS = process.env.TEST_PASS || '1234';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log('== TEST GAME ENDPOINTS ==');
  console.log(`API: ${API_URL}`);
  console.log(`Usuario: ${TEST_USER}`);

  let token;
  let gameId;

  try {
    console.log('\n1) Login');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      nombre_usuario: TEST_USER,
      password: TEST_PASS
    });

    assert(loginRes.status === 200, 'Login no devolvio 200');
    assert(loginRes.data && loginRes.data.token, 'No se recibio token en login');
    token = loginRes.data.token;
    console.log('OK login');

    const authHeaders = { Authorization: `Bearer ${token}` };

    console.log('\n2) Crear partida');
    const createRes = await axios.post(
      `${API_URL}/partidas`,
      {
        numCartasInicio: 7,
        modoCartasEspeciales: true,
        modoRoles: false,
        maxJugadores: 4,
        timeoutTurno: 30,
        sonido: true,
        musica: true,
        vibracion: true,
        privada: false
      },
      { headers: authHeaders }
    );

    assert(createRes.status === 201, 'Crear partida no devolvio 201');
    assert(createRes.data && createRes.data.gameId, 'Crear partida no devolvio gameId');
    gameId = createRes.data.gameId;
    console.log(`OK partida creada: ${gameId}`);

    console.log('\n3) Obtener lobby');
    const lobbyRes = await axios.get(`${API_URL}/partidas/${gameId}`, {
      headers: authHeaders
    });

    assert(lobbyRes.status === 200, 'Lobby no devolvio 200');
    assert(lobbyRes.data && lobbyRes.data.gameId, 'Lobby sin gameId');
    assert(Array.isArray(lobbyRes.data.jugadores), 'Lobby sin lista de jugadores');
    console.log('OK lobby');

    console.log('\n4) Obtener estado');
    const stateRes = await axios.get(`${API_URL}/partidas/${gameId}/state`, {
      headers: authHeaders
    });

    assert(stateRes.status === 200, 'Estado no devolvio 200');
    assert(stateRes.data && stateRes.data.gameId, 'Estado sin gameId');
    assert(Array.isArray(stateRes.data.players), 'Estado sin players');
    console.log('OK estado');

    console.log('\n5) Probar proteccion auth (sin token)');
    try {
      await axios.get(`${API_URL}/partidas/${gameId}`);
      throw new Error('El endpoint permitio acceso sin token');
    } catch (error) {
      const status = error.response && error.response.status;
      assert(status === 401, `Se esperaba 401 sin token, se obtuvo ${status}`);
      console.log('OK auth requerida');
    }

    console.log('\nRESULTADO: TEST EXITOSO');
  } catch (error) {
    console.error('\nRESULTADO: TEST FALLIDO');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    }
    console.error('Detalle:', error.message);
    process.exitCode = 1;
  }
}

run();
