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
  console.log('=== TEST DE SISTEMA DE PAUSAS Y LISTADO ===\n');

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

    console.log('   Gonzalo solicita pausar la partida (1 humano = 1 voto requerido)...');
    let pauseRes1 = await axios.post(`${API_URL}/partidas/${gameId1}/pause`, {}, { headers: headersGonzalo });
    
    console.log('   Verificando el estado...');
    assert(pauseRes1.data.action === 'pausada', `La accion debería ser 'pausada', pero es '${pauseRes1.data.action}'`);
    console.log('   ✅ ESCENARIO 1 SUPERADO: La partida se pausó instantáneamente.\n');


    // ==========================================================
    // ESCENARIO 2: 2 HUMANOS Y VERIFICACIÓN DE LISTADO
    // ==========================================================
    console.log('🎬 [ESCENARIO 2] 2 Humanos (Gonzalo y Amigo) + Verificación de Listado');
    
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

    console.log('   Gonzalo solicita pausar la partida (1er voto)...');
    let pauseVote1 = await axios.post(`${API_URL}/partidas/${gameId2}/pause`, {}, { headers: headersGonzalo });
    
    assert(pauseVote1.data.action === 'voto_pausa_registrado', 'La partida NO debería pausarse con solo 1 voto');
    console.log('   ✅ Correcto: La partida sigue activa esperando mayoría (1/2 votos).');

    console.log('   Amigo solicita pausar la partida (2do voto)...');
    let pauseVote2 = await axios.post(`${API_URL}/partidas/${gameId2}/pause`, {}, { headers: headersAmigo });
    
    assert(pauseVote2.data.action === 'pausada', 'La partida DEBERÍA haberse pausado con 2 votos');
    console.log('   ✅ Correcto: La partida se ha pausado exitosamente por mayoría absoluta.');

    // --- TEST LISTADO MIENTRAS ESTÁ PAUSADA ---
    console.log('\n🔍 [TEST LISTADO] Verificando que las partidas aparecen como pausadas...');
    
    let listadoGonzalo = await axios.get(`${API_URL}/partidas/pausadas`, { headers: headersGonzalo });
    let idsGonzalo = listadoGonzalo.data.data.map(p => p.id_partida);
    assert(idsGonzalo.includes(gameId1), 'Gonzalo debería ver la partida 1 en su lista de pausadas');
    assert(idsGonzalo.includes(gameId2), 'Gonzalo debería ver la partida 2 en su lista de pausadas');
    console.log('   ✅ Correcto: Gonzalo ve sus dos partidas pausadas.');

    let listadoAmigo = await axios.get(`${API_URL}/partidas/pausadas`, { headers: headersAmigo });
    let idsAmigo = listadoAmigo.data.data.map(p => p.id_partida);
    assert(!idsAmigo.includes(gameId1), 'El Amigo NO debería ver la partida 1 (no está en ella)');
    assert(idsAmigo.includes(gameId2), 'El Amigo debería ver la partida 2 en su lista de pausadas');
    console.log('   ✅ Correcto: El Amigo ve solo la partida en la que participa.\n');
    // -----------------------------------------------------------

    console.log('   Gonzalo solicita reanudar la partida (1er voto para reanudar)...');
    let resumeVote1 = await axios.post(`${API_URL}/partidas/${gameId2}/resume`, {}, { headers: headersGonzalo });
    
    assert(resumeVote1.data.action === 'voto_reanudar_registrado', 'La partida NO debería reanudarse con solo 1 voto');
    console.log('   ✅ Correcto: La partida sigue pausada esperando mayoría (1/2 votos).');

    console.log('   Amigo solicita reanudar la partida (2do voto para reanudar)...');
    let resumeVote2 = await axios.post(`${API_URL}/partidas/${gameId2}/resume`, {}, { headers: headersAmigo });
    
    assert(resumeVote2.data.action === 'reanudada', 'La partida DEBERÍA estar jugando de nuevo');
    console.log('   ✅ Correcto: La partida se ha reanudado exitosamente por mayoría absoluta.');
    
    // --- TEST LISTADO DESPUÉS DE REANUDAR ---
    console.log('\n🔍 [TEST LISTADO] Verificando que la partida 2 desapareció de la lista de pausadas...');
    let listadoGonzaloPost = await axios.get(`${API_URL}/partidas/pausadas`, { headers: headersGonzalo });
    let idsGonzaloPost = listadoGonzaloPost.data.data.map(p => p.id_partida);
    
    assert(idsGonzaloPost.includes(gameId1), 'Gonzalo aún debería ver la partida 1 como pausada');
    assert(!idsGonzaloPost.includes(gameId2), 'Gonzalo ya NO debería ver la partida 2 como pausada');
    console.log('   ✅ Correcto: La partida 2 ya no le sale a Gonzalo en las pausadas.');
    // -----------------------------------------------------------

    console.log('\n   ✅ ESCENARIO 2 SUPERADO.\n');

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