const { spawnSync } = require('child_process');
const path = require('path');

const tests = [
  'testAuth.js',
  'testUser.js',
  'testCrearPartida.js',
  'testGameEndpoints.js',
  'testRoles.js',
  'testChat.js',
  'testFriends.js',
  'testWallet.js',
  'testComprarAvatar.js',
  'testComprarEstilo.js',
  'testGamePlayFlow.js',
  'testFlujoPartida.js',
  'testPlayRealCard.js',
  'testPausas.js',
  'testSocket.js',
  'testModules.js',
  'oddEven.test.js'
];

const testDir = path.join(__dirname);

function runTest(file) {
  const filePath = path.join(testDir, file);
  console.log(`\n=== Ejecutando ${file} ===`);

  const result = spawnSync(process.execPath, [filePath], {
    stdio: 'inherit',
    cwd: testDir
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Test fallido: ${file} (exit code ${result.status})`);
  }
}

function main() {
  console.log('Iniciando ejecución lógica de tests...');
  console.log(`Ruta base: ${testDir}`);

  for (const testFile of tests) {
    try {
      runTest(testFile);
    } catch (error) {
      console.error(`\n✖ Error ejecutando ${testFile}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✅ Todos los tests se ejecutaron correctamente.');
}

main();
