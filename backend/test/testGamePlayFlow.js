const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
const OWNER_USER = process.env.TEST_USER || 'gonzalo';
const OWNER_PASS = process.env.TEST_PASS || '1234';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function randomUser() {
  const n = Date.now();
  return {
    nombre_usuario: `playtest_${n}`,
    correo: `playtest_${n}@mail.com`,
    password: '1234'
  };
}

async function login(nombre_usuario, password) {
  const res = await axios.post(`${API_URL}/auth/login`, { nombre_usuario, password });
  return res.data.token;
}

async function registerAndLoginSecondaryUser() {
  const user = randomUser();
  await axios.post(`${API_URL}/auth/register`, user);
  const token = await login(user.nombre_usuario, user.password);
  return { user, token };
}

async function run() {
  console.log('== TEST GAME PLAY FLOW ==');

  try {
    console.log('\n1) Login owner');
    const ownerToken = await login(OWNER_USER, OWNER_PASS);
    const ownerHeaders = { Authorization: `Bearer ${ownerToken}` };

    console.log('\n2) Crear usuario secundario y login');
    const secondary = await registerAndLoginSecondaryUser();
    const secondaryHeaders = { Authorization: `Bearer ${secondary.token}` };

    console.log('\n3) Crear partida');
    const createRes = await axios.post(
      `${API_URL}/partidas`,
      {
        numCartasInicio: 7,
        modoCartasEspeciales: true,
        modoRoles: false,
        maxJugadores: 4,
        timeoutTurno: 30,
        privada: false
      },
      { headers: ownerHeaders }
    );

    const gameId = createRes.data.gameId;
    assert(gameId, 'No se obtuvo gameId al crear partida');
    console.log(`Partida: ${gameId}`);

    console.log('\n4) Unirse a la partida con usuario secundario');
    const joinRes = await axios.post(`${API_URL}/partidas/${gameId}/join`, {}, { headers: secondaryHeaders });
    assert(joinRes.status === 200, 'Join no devolvio 200');

    console.log('\n5) Iniciar partida con owner');
    const startRes = await axios.post(`${API_URL}/partidas/${gameId}/start`, {}, { headers: ownerHeaders });
    assert(startRes.status === 200, 'Start no devolvio 200');

    console.log('\n6) Verificar estado en playing');
    const ownerState = await axios.get(`${API_URL}/partidas/${gameId}/state`, { headers: ownerHeaders });
    assert(ownerState.data.phase === 'playing', `Se esperaba phase=playing y fue ${ownerState.data.phase}`);

    const currentTurn = ownerState.data.currentTurn;
    console.log(`Turno actual: ${currentTurn}`);

    console.log('\n7) Robar carta con el jugador de turno');
    const turnHeaders = currentTurn === OWNER_USER ? ownerHeaders : secondaryHeaders;
    const drawRes = await axios.post(`${API_URL}/partidas/${gameId}/draw-card`, {}, { headers: turnHeaders });

    assert(drawRes.status === 200, 'Draw no devolvio 200');
    assert(drawRes.data && drawRes.data.cardDrawn, 'Draw no devolvio cardDrawn');
    console.log('Draw OK');

    console.log('\n8) Verificar que turno avance');
    const stateAfterDraw = await axios.get(`${API_URL}/partidas/${gameId}/state`, { headers: ownerHeaders });
    assert(
      stateAfterDraw.data.currentTurn !== currentTurn,
      'El turno no avanzo despues de robar'
    );

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
