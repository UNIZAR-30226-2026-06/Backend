const axios = require('axios');
const { io } = require('socket.io-client');

// Ajusta estas URLs según tu entorno (con o sin /api/v1 dependiendo de tus rutas)
const API_URL = 'http://localhost:3000/api/v1'; 
const SOCKET_URL = 'http://localhost:3000';
const OWNER_USER = 'gonzalo';
const OWNER_PASS = '1234';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Función auxiliar para esperar unos segundos
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTestBotFlow() {
  console.log('== TEST HUMANO VS BOT CON SOCKETS ==\n');
  let socket;

  try {
    // 1️⃣ LOGIN DEL HUMANO
    console.log('1) Login humano...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      nombre_usuario: OWNER_USER,
      password: OWNER_PASS
    });
    const token = loginRes.data.token;
    assert(token, 'No se obtuvo token en login');
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log('   OK. Token obtenido.\n');

    // 2️⃣ CONECTAR SOCKET
    console.log('2) Conectando Socket...');
    socket = io(SOCKET_URL, {
      auth: { token: token }
    });

    await new Promise((resolve, reject) => {
      socket.on('connect', resolve);
      socket.on('connect_error', reject);
    });
    console.log(`   OK. Socket conectado (ID: ${socket.id})\n`);

    // 3️⃣ CREAR PARTIDA
    console.log('3) Creando partida para 2 jugadores...');
    const createRes = await axios.post(
      `${API_URL}/partidas`,
      {
        numCartasInicio: 7,
        modoCartasEspeciales: true,
        modoRoles: false,
        maxJugadores: 2, // Partida de 2 para forzar Humano vs Bot
        timeoutTurno: 30,
        privada: false
      },
      { headers: authHeaders }
    );
    const gameId = createRes.data.gameId;
    assert(gameId, 'No se obtuvo gameId al crear partida');
    console.log(`   OK. Partida creada: ${gameId}\n`);

    // 4️⃣ UNIRSE A LA ROOM DEL SOCKET
    console.log('4) Uniendo socket a la room de la partida...');
    socket.emit('unirse_room_partida', gameId);
    // Damos un pequeño margen para que el backend lo procese
    await sleep(500); 
    console.log('   OK. Unido a la sala.\n');

    // 5️⃣ AÑADIR BOT
    console.log('5) Añadiendo Bot...');
    const addBotRes = await axios.post(
      `${API_URL}/partidas/${gameId}/add-bot`,
      {},
      { headers: authHeaders }
    );
    assert(addBotRes.status === 200, 'Error al añadir bot');
    console.log(`   OK. Bot añadido: ${addBotRes.data.botId}\n`);

    // 6️⃣ INICIAR PARTIDA
    console.log('6) Iniciando partida...');
    const startRes = await axios.post(
      `${API_URL}/partidas/${gameId}/start`,
      {},
      { headers: authHeaders }
    );
    assert(startRes.status === 200, 'Start no devolvio 200');
    console.log('   OK. Partida iniciada.\n');

    // 7️⃣ OBTENER ESTADO Y VER DE QUIÉN ES EL TURNO
    console.log('7) Obteniendo estado actual...');
    let stateRes = await axios.get(`${API_URL}/partidas/${gameId}/state`, { headers: authHeaders });
    let currentTurn = stateRes.data.currentTurn;
    console.log(`   El primer turno es de: ${currentTurn}\n`);

    // Preparamos una Promesa para capturar el evento del bot por socket
    const botActionPromise = new Promise((resolve) => {
      socket.on('bot_action', (data) => {
        console.log(`   --> [SOCKET EVENT] ¡El bot ha jugado!`);
        console.log(`       Bot ID: ${data.botId}`);
        console.log(`       Acción: ${data.action}`);
        if (data.cardPlayed) console.log(`       Carta: ${data.cardPlayed.color} ${data.cardPlayed.value}`);
        resolve(data);
      });
    });

    // 8️⃣ FORZAR TURNO DEL BOT (si le toca al humano)
    if (currentTurn === OWNER_USER) {
      console.log('   Es turno del humano. Robando carta para pasar turno al bot...');
      await axios.post(`${API_URL}/partidas/${gameId}/draw-card`, {}, { headers: authHeaders });
      console.log('   Humano robó carta. Esperando que el worker detecte el turno del bot...');
    } else {
      console.log('   Es el turno del bot desde el principio. Esperando que el worker actúe...');
    }

    // 9️⃣ ESPERAR A QUE EL BOT JUEGUE (TIMEOUT DE SEGURIDAD: 10 seg)
    console.log('9) Esperando evento "bot_action" a través de WebSockets...');
    
    // Usamos Promise.race para que el test no se quede colgado si falla el bot
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('El bot no jugó en el tiempo esperado (10s)')), 10000)
    );

    await Promise.race([botActionPromise, timeoutPromise]);
    console.log('\n   OK. ¡El flujo Humano vs Bot funciona perfectamente!');

    console.log('\nRESULTADO: TEST EXITOSO ✅\n');

  } catch (error) {
    console.error('\nRESULTADO: TEST FALLIDO ❌');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    }
    console.error('Detalle:', error.message);
  } finally {
    if (socket) {
      socket.disconnect();
    }
    process.exit();
  }
}

runTestBotFlow();