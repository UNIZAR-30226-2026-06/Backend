const axios = require('axios');

const API = process.env.API_URL || 'http://localhost:3000/api/v1';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function randomUser() {
  const suffix = Date.now();
  return {
    nombre_usuario: `tester_roles_${suffix}`,
    correo: `tester_roles_${suffix}@mail.com`,
    password: 'Test1234!'
  };
}

async function registerUser(user) {
  const response = await axios.post(`${API}/auth/register`, user, {
    headers: { 'Content-Type': 'application/json' }
  });
  assert(response.status === 201 || response.status === 200, 'Registro no devolvió 200/201');
  assert(response.data && response.data.token, 'Registro no devolvió token');
  return response.data.token;
}

async function loginUser(user) {
  const response = await axios.post(`${API}/auth/login`, {
    nombre_usuario: user.nombre_usuario,
    password: user.password
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  assert(response.status === 200, 'Login no devolvió 200');
  assert(response.data && response.data.token, 'Login no devolvió token');
  return response.data.token;
}

async function createGame(token) {
  const response = await axios.post(
    `${API}/partidas`,
    {
      numCartasInicio: 7,
      modoCartasEspeciales: true,
      modoRoles: true,
      maxJugadores: 2,
      timeoutTurno: 30,
      privada: false,
      sonido: true,
      musica: true,
      vibracion: true
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  assert(response.status === 201, 'Crear partida no devolvió 201');
  assert(response.data && response.data.gameId, 'Crear partida no devolvió gameId');
  return response.data.gameId;
}

async function addBot(token, gameId) {
  const response = await axios.post(
    `${API}/partidas/${gameId}/add-bot`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  assert(response.status === 200, 'Añadir bot no devolvió 200');
  assert(response.data && response.data.success, 'Añadir bot no devolvió success');
  assert(response.data.botId, 'Añadir bot no devolvió botId');
  return response.data.botId;
}

async function startGame(token, gameId) {
  const response = await axios.post(
    `${API}/partidas/${gameId}/start`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  assert(response.status === 200, 'Iniciar partida no devolvió 200');
  assert(response.data && response.data.started === true, 'Iniciar partida no devolvió started true');
}

async function getGameState(token, gameId) {
  const response = await axios.get(`${API}/partidas/${gameId}/state`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(response.status === 200, 'Estado de partida no devolvió 200');
  return response.data;
}

async function getMyRole(token, gameId) {
  const response = await axios.get(`${API}/roles/${gameId}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(response.status === 200, 'GET /roles/:gameId/me no devolvió 200');
  return response.data;
}

async function getMyUses(token, gameId) {
  const response = await axios.get(`${API}/roles/${gameId}/me/uses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(response.status === 200, 'GET /roles/:gameId/me/uses no devolvió 200');
  return response.data;
}

async function useRole(token, gameId, payload) {
  const response = await axios.post(
    `${API}/roles/${gameId}/use`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  assert(response.status === 200, 'POST /roles/:gameId/use no devolvió 200');
  return response.data;
}

function pickMyPlayer(state, username) {
  if (!state || !Array.isArray(state.players)) return null;
  return state.players.find((player) => player.id === username) || null;
}

function pickTargetPlayer(state, username) {
  if (!state || !Array.isArray(state.players)) return null;
  return state.players.find((player) => player.id !== username) || null;
}

function buildUsePayload(role, state, username) {
  const player = pickMyPlayer(state, username);
  const target = pickTargetPlayer(state, username);

  if (!role || !player) {
    return {};
  }

  const normalized = String(role.nombre || '').toLowerCase();

  if (normalized.includes('espía') || normalized.includes('espia')) {
    return { targetPlayerId: target?.id };
  }

  if (normalized.includes('ladrón') || normalized.includes('ladron')) {
    const ownCardId = player.hand?.[0]?.id;
    return { targetPlayerId: target?.id, ownCardId };
  }

  if (normalized.includes('anular')) {
    return { cardId: player.hand?.[0]?.id };
  }

  if (normalized.includes('transformar')) {
    const normalCard = (player.hand || []).find((card) => card.type === 'normal');
    if (normalCard) {
      return { cardId: normalCard.id, newColor: normalCard.color === 'red' ? 'blue' : 'red' };
    }
    return { cardId: player.hand?.[0]?.id, newColor: 'blue' };
  }

  return {};
}

async function run() {
  console.log('=== TEST DE ROLES ===');
  const user = randomUser();
  let token;
  let gameId;

  try {
    console.log('1) Registrando usuario');
    token = await registerUser(user);
    console.log('Usuario registrado y autenticado');

    console.log('2) Creando partida con roles activados');
    gameId = await createGame(token);
    console.log('Partida creada:', gameId);

    console.log('3) Añadiendo un bot para que la partida tenga al menos dos jugadores');
    await addBot(token, gameId);
    console.log('Bot añadido');

    console.log('4) Iniciando partida');
    await startGame(token, gameId);
    console.log('Partida iniciada');

    console.log('5) Consultando estado de partida');
    const state = await getGameState(token, gameId);
    assert(state.gameId === gameId, 'El estado de partida no contiene el gameId esperado');
    console.log('Turno actual:', state.currentTurn);

    const myPlayer = pickMyPlayer(state, user.nombre_usuario);
    assert(myPlayer, 'No se encontró al jugador en el estado de la partida');
    console.log(`Jugador local encontrado: ${myPlayer.id}`);

    console.log('6) Consultando rol asignado');
    const myRole = await getMyRole(token, gameId);
    assert(myRole.role, 'El endpoint de rol no devolvió la propiedad role');
    assert(typeof myRole.canUseNow === 'boolean', 'El endpoint de rol no devolvió canUseNow');
    console.log('Rol asignado:', myRole.role.nombre);
    console.log('Puede usar ahora:', myRole.canUseNow);

    console.log('7) Consultando usos de rol iniciales');
    const uses = await getMyUses(token, gameId);
    assert(uses.uses === 0, 'Los usos iniciales deberían ser 0');
    console.log('Usos iniciales:', uses.uses);

    const payload = buildUsePayload(myRole.role, state, user.nombre_usuario);

    if (myRole.canUseNow) {
      console.log('8) Usando el rol en turno');
      const useResult = await useRole(token, gameId, payload);
      assert(useResult.success === true, 'El uso del rol no devolvió success true');
      assert(useResult.role, 'El resultado no devolvió información del rol');
      console.log('Uso de rol exitoso:', useResult.role.nombre);

      console.log('9) Verificando que los usos se incrementaron');
      const usesAfter = await getMyUses(token, gameId);
      assert(usesAfter.uses === 1, 'El contador de usos no se incrementó tras usar el rol');
      console.log('Usos actualizados:', usesAfter.uses);

      console.log('10) Intentando usar el rol de nuevo en el mismo turno para validar el bloqueo');
      try {
        await useRole(token, gameId, payload);
        throw new Error('El segundo uso en el mismo turno debería haber fallado');
      } catch (error) {
        const response = error.response;
        assert(response, 'No se recibió respuesta de error esperada');
        assert(response.status === 400, `Se esperaba 400 al usar rol dos veces en el mismo turno, se obtuvo ${response.status}`);
        console.log('Validación de doble uso en el mismo turno correcta:', response.data?.message || 'Error esperado');
      }
    } else {
      console.log('8) No es el turno del jugador local; verificando rechazo del uso de rol');
      try {
        await useRole(token, gameId, payload);
        throw new Error('El uso fuera de turno debería haber fallado');
      } catch (error) {
        const response = error.response;
        assert(response, 'No se recibió respuesta de error esperada');
        assert(response.status === 403 || response.status === 400, 'Se esperaba 403/400 al usar rol fuera de turno');
        console.log('Uso de rol fuera de turno correctamente rechazado:', response.data?.message || 'Error esperado');
      }
    }

    console.log('\n=== TEST DE ROLES FINALIZADO CON ÉXITO ===');
  } catch (error) {
    console.error('\n=== TEST DE ROLES FALLÓ ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    }
    console.error(error.message);
    process.exitCode = 1;
  }
}

run();
