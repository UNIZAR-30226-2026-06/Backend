const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';
const OWNER_USER = process.env.TEST_USER || 'gonzalo';
const OWNER_PASS = process.env.TEST_PASS || '1234';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function randomUser() {
  const n = Date.now();
  return {
    nombre_usuario: `playreal_${n}`,
    correo: `playreal_${n}@mail.com`,
    password: '1234'
  };
}

function canPlay(card, discardTop) {
  if (!discardTop) return true;
  return card.color === discardTop.color || card.value === discardTop.value || card.color === 'black';
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
  console.log('== TEST PLAY REAL CARD ==');

  try {
    const ownerToken = await login(OWNER_USER, OWNER_PASS);
    const ownerHeaders = { Authorization: `Bearer ${ownerToken}` };

    const secondary = await registerAndLoginSecondaryUser();
    const secondaryHeaders = { Authorization: `Bearer ${secondary.token}` };

    const createRes = await axios.post(
      `${API_URL}/partidas`,
      {
        numCartasInicio: 15,
        modoCartasEspeciales: true,
        modoRoles: false,
        maxJugadores: 4,
        timeoutTurno: 30,
        privada: false
      },
      { headers: ownerHeaders }
    );

    const gameId = createRes.data.gameId;
    assert(gameId, 'No se obtuvo gameId');

    await axios.post(`${API_URL}/partidas/${gameId}/join`, {}, { headers: secondaryHeaders });
    await axios.post(`${API_URL}/partidas/${gameId}/start`, {}, { headers: ownerHeaders });

    const ownerState = await axios.get(`${API_URL}/partidas/${gameId}/state`, { headers: ownerHeaders });
    const currentTurn = ownerState.data.currentTurn;

    const turnHeaders = currentTurn === OWNER_USER ? ownerHeaders : secondaryHeaders;
    const turnStateRes = await axios.get(`${API_URL}/partidas/${gameId}/state`, { headers: turnHeaders });
    const turnState = turnStateRes.data;

    const myPlayer = turnState.players.find((p) => p.id === currentTurn);
    assert(myPlayer, 'No se encontro jugador actual en estado');
    assert(Array.isArray(myPlayer.hand), 'La mano del jugador actual no viene expandida');

    const playable = myPlayer.hand.find((c) => canPlay(c, turnState.discardTop));
    assert(playable, 'No se encontro carta jugable en mano para test');

    const playRes = await axios.post(
      `${API_URL}/partidas/${gameId}/play-card`,
      { cardId: playable.id },
      { headers: turnHeaders }
    );

    assert(playRes.status === 200, 'play-card no devolvio 200');
    assert(playRes.data && playRes.data.success === true, 'play-card no devolvio success=true');

    console.log('RESULTADO: TEST EXITOSO');
  } catch (error) {
    console.error('RESULTADO: TEST FALLIDO');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    }
    console.error('Detalle:', error.message);
    process.exitCode = 1;
  }
}

run();
