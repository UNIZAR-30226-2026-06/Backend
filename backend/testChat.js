const fetch = require('node-fetch');
const API = 'http://localhost:3000';

// JWT generado por testAuth
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfdXN1YXJpbyI6InRlc3RlcjE3NzI3OTE5OTcyNTkiLCJpYXQiOjE3NzI3OTE5OTgsImV4cCI6MTc3Mjc5NTU5OH0.OcGq6CM6bpWwkZcNwCwZ76KVWOzUArXCIrJPc0s_B6k'
async function run() {
    console.log('=== CHAT MODULE (SIMULADO) ===');

    if (!JWT) {
        console.error('❌ JWT no definido, ejecuta testAuth primero');
        return;
    }

    // Placeholder: usamos /usuarios/me para validar JWT
    const res = await fetch(`${API}/api/v1/usuarios/me`, {
        headers: { 'Authorization': `Bearer ${JWT}` }
    });

    try {
        const data = await res.json();
        console.log('Chat placeholder response (usuarios/me):', data);
    } catch (err) {
        console.error('Error JSON:', err.message);
    }
}

run();