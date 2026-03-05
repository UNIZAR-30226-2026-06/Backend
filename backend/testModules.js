// testAll.js
const fetch = require('node-fetch');
const API = 'http://localhost:3000';

// Genera usuario aleatorio
function randomUser() {
  const r = Math.floor(Math.random() * 100000);
  return { nombre_usuario: `tester${r}`, correo: `tester${r}@mail.com`, password: '1234' };
}

async function run() {
  const user = randomUser();
  console.log('=== TEST USER ===', user);

  // ================= AUTH REGISTER =================
  try {
    let res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    let data = await res.json();
    console.log('\n=== REGISTER RESPONSE ===', data);
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    return;
  }

  // ================= AUTH LOGIN =================
  let JWT = '';
  try {
    let res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_usuario: user.nombre_usuario, password: user.password })
    });
    let data = await res.json();
    console.log('\n=== LOGIN RESPONSE ===', data);
    if (!data.token) throw new Error('No se recibió token en login');
    JWT = data.token;
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    return;
  }

  const headers = { 'Authorization': `Bearer ${JWT}`, 'Content-Type': 'application/json' };

  // ================= USER PROFILE =================
  try {
    let res = await fetch(`${API}/usuarios/me`, { headers });
    let data = await res.json();
    console.log('\n=== USER PROFILE ===', data);
  } catch (err) {
    console.error('USER PROFILE ERROR:', err.message);
  }

  // ================= CHAT MATCH =================
  try {
    let res = await fetch(`${API}/chat/match`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mensaje: 'Hola mundo desde test' })
    });
    let data = await res.json();
    console.log('\n=== CHAT MATCH RESPONSE ===', data);
  } catch (err) {
    console.error('CHAT MATCH ERROR:', err.message);
  }

  // ================= WALLET BALANCE =================
  try {
    let res = await fetch(`${API}/wallet/balance`, { headers });
    let data = await res.json();
    console.log('\n=== WALLET BALANCE RESPONSE ===', data);
  } catch (err) {
    console.error('WALLET BALANCE ERROR:', err.message);
  }

  console.log('\n=== ALL TESTS COMPLETED ===');
}

run();