const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1'; // Ajusta si tu ruta es distinta

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function login(username, password = '1234') {
  const res = await axios.post(`${API_URL}/auth/login`, { nombre_usuario: username, password });
  return res.data.token;
}

// Creamos un usuario de "usar y tirar" para no depender de la BD en cada prueba
async function crearUsuarioAleatorio() {
  const r = Date.now();
  const user = { nombre_usuario: `tester_${r}`, correo: `test_${r}@mail.com`, password: '1234' };
  await axios.post(`${API_URL}/auth/register`, user);
  return user.nombre_usuario;
}

async function runTests() {
  console.log('=== TEST DE SISTEMA DE PAUSAS (1 Pausa, Mayoría Reanuda) ===\n');

  try {
    console.log('🔑 Haciendo login de Gonzalo...');
    const tokenGonzalo = await login('gonzalo', '1234');
    const headersGonzalo = { Authorization: `Bearer ${tokenGonzalo}` };

    // ==========================================================
    // ESCENARIO 1: 1 HUMANO VS 2 BOTS
    // ==========================================================
    console.log('\n🎬 [ESCENARIO 1] 1 Humano vs 2 Bots');
    
    console.log('   Creando partida de 3 jugadores...');
    let res = await axios.post(`${API_URL}/partidas`, { maxJugadores: 3, privada: true }, { headers: headersGonzalo });
    const gameId1 = res.data.gameId;
    
    console.log('   Añadiendo 2 bots...');
    await axios.post(`${API_URL}/partidas/${gameId1}/add-bot`, {}, { headers: headersGonzalo });
    await axios.post(`${API_URL}/partidas/${gameId1}/add-bot`, {}, { headers: headersGonzalo });

    console.log('   Iniciando partida...');
    await axios.post(`${API_URL}/partidas/${gameId1}/start`, {}, { headers: headersGonzalo });

    console.log('   Gonzalo solicita pausar la partida...');
    let pauseRes1 = await axios.post(`${API_URL}/partidas/${gameId1}/pause`, {}, { headers: headersGonzalo });
    
    console.log('   Verificando el estado...');
    // Comprobamos directamente si la fase dentro del estado es 'paused'
    assert(pauseRes1.data.phase === 'paused', `La fase debería ser 'paused', pero es '${pauseRes1.data.phase}'`);
    console.log('   ✅ ESCENARIO 1 SUPERADO: La partida se pausó instantáneamente porque 1 voto es suficiente.\n');


    // ==========================================================
    // ESCENARIO 2: 2 HUMANOS
    // ==========================================================
    console.log('🎬 [ESCENARIO 2] 2 Humanos (Gonzalo y Amigo)');
    
    console.log('   Creando usuario Amigo...');
    const amigoUser = await crearUsuarioAleatorio();
    const tokenAmigo = await login(amigoUser, '1234');
    const headersAmigo = { Authorization: `Bearer ${tokenAmigo}` };

    console.log('   Gonzalo crea partida de 2 jugadores privada...');
    let res2 = await axios.post(`${API_URL}/partidas`, { maxJugadores: 2, privada: true }, { headers: headersGonzalo });
    const gameId2 = res2.data.gameId;
    const codigo = res2.data.codigo;

    console.log(`   Amigo se une usando el código ${codigo}...`);
    await axios.post(`${API_URL}/partidas/join-by-code`, { codigo }, { headers: headersAmigo });

    console.log('   Gonzalo inicia la partida...');
    await axios.post(`${API_URL}/partidas/${gameId2}/start`, {}, { headers: headersGonzalo });

    console.log('   Gonzalo solicita pausar la partida (1 voto)...');
    let pauseVote1 = await axios.post(`${API_URL}/partidas/${gameId2}/pause`, {}, { headers: headersGonzalo });
    
    // AHORA SE PAUSA INSTANTÁNEAMENTE CON 1 VOTO
    assert(pauseVote1.data.phase === 'paused', 'La partida DEBERÍA haberse pausado inmediatamente');
    console.log('   ✅ Correcto: La partida se ha pausado instantáneamente a petición de Gonzalo.');

    console.log('   Gonzalo solicita reanudar la partida (1 voto para reanudar)...');
    let resumeVote1 = await axios.post(`${API_URL}/partidas/${gameId2}/resume`, {}, { headers: headersGonzalo });
    
    // Como son 2 humanos, la mayoría requiere 2 votos. Así que sigue pausada.
    assert(resumeVote1.data.phase === 'paused', 'La partida NO debería reanudarse con solo 1 voto');
    console.log('   ✅ Correcto: La partida sigue pausada esperando mayoría (1/2 votos).');

    console.log('   Amigo solicita reanudar la partida (2 votos para reanudar)...');
    let resumeVote2 = await axios.post(`${API_URL}/partidas/${gameId2}/resume`, {}, { headers: headersAmigo });
    
    // Al votar el amigo, se alcanza la mayoría y se reanuda
    assert(resumeVote2.data.phase === 'playing', 'La partida DEBERÍA estar jugando de nuevo');
    console.log('   ✅ Correcto: La partida se ha reanudado exitosamente por mayoría absoluta.');
    
    console.log('   ✅ ESCENARIO 2 SUPERADO.\n');

    console.log('🎉 ¡TODOS LOS TESTS PASARON CON ÉXITO!');

  } catch (error) {
    console.error('\n❌ ERROR EN EL TEST');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    } else {
      console.error('Detalle:', error.message);
    }
  }
}

runTests();