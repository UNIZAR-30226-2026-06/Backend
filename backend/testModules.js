// testModules.js
const fetch = require('node-fetch');

const API = 'http://localhost:3000';

// Función para generar usuario aleatorio
function randomUser() {
    const r = Math.floor(Math.random() * 10000);
    return { nombre_usuario: `tester${r}`, correo: `tester${r}@mail.com`, password: '1234' };
}

async function run() {
    console.log('=== STARTING MODULES TEST ===\n');
    const user = randomUser();
    let JWT = '';

    // ================= AUTH =================
    try {
        console.log('=== AUTH TEST ===');

        // Registro
        let res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_usuario: user.nombre_usuario,
                password: user.password,
                correo: user.correo
            })
        });
        let data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('Register status:', res.status, 'response:', data);

        // Login
        res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_usuario: user.nombre_usuario,
                password: user.password
            })
        });
        data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('Login response:', data);
        JWT = data.token;

        if (!JWT) {
            console.error('No se pudo obtener JWT, abortando tests de módulos protegidos.');
            return;
        }
    } catch (e) {
        console.error('AUTH error:', e.message);
        return;
    }

    // ================= CHAT =================
    try {
        console.log('\n=== CHAT TEST ===');
        const res = await fetch(`${API}/chat/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT}`
            },
            body: JSON.stringify({ mensaje: 'Hola mundo' })
        });
        const data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('Chat response:', data);
    } catch (e) {
        console.error('CHAT error:', e.message);
    }

    // ================= WALLET =================
    try {
        console.log('\n=== WALLET TEST ===');
        const res = await fetch(`${API}/wallet/balance`, {
            headers: { 'Authorization': `Bearer ${JWT}` }
        });
        const data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('Wallet balance response:', data);
    } catch (e) {
        console.error('WALLET error:', e.message);
    }

    // ================= FRIENDS =================
    try {
        console.log('\n=== FRIENDS TEST ===');
        const res = await fetch(`${API}/friends/pending`, {
            headers: { 'Authorization': `Bearer ${JWT}` }
        });
        const data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('Friends pending response:', data);
    } catch (e) {
        console.error('FRIENDS error:', e.message);
    }

    // ================= USER =================
    try {
        console.log('\n=== USER TEST ===');
        const res = await fetch(`${API}/api/v1/usuarios/${user.nombre_usuario}`, {
            headers: { 'Authorization': `Bearer ${JWT}` }
        });
        const data = await res.json().catch(() => ({ error: 'Invalid JSON' }));
        console.log('User info response:', data);
    } catch (e) {
        console.error('USER error:', e.message);
    }

    console.log('\n=== ALL MODULES TEST COMPLETED ===');
}

run();