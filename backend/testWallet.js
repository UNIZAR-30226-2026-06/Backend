const fetch = require('node-fetch');
const API = 'http://localhost:3000';

// JWT generado por testAuth
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfdXN1YXJpbyI6InRlc3RlcjE3NzI3OTE5OTcyNTkiLCJpYXQiOjE3NzI3OTE5OTgsImV4cCI6MTc3Mjc5NTU5OH0.OcGq6CM6bpWwkZcNwCwZ76KVWOzUArXCIrJPc0s_B6k'
async function run() {
    console.log('=== WALLET MODULE ===');

    if (!JWT) {
        console.error('❌ JWT no definido, ejecuta testAuth primero');
        return;
    }

    try {
        // 1️⃣ Consultar balance
        let res = await fetch(`${API}/wallet/balance`, {
            headers: { 'Authorization': `Bearer ${JWT}` }
        });
        let data = await res.json();
        console.log('Initial balance:', data);

        // 2️⃣ Añadir monedas
        const addAmount = 100;
        res = await fetch(`${API}/wallet/add`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${JWT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: addAmount })
        });
        data = await res.json();
        console.log(`Added ${addAmount} coins:`, data);

        // 3️⃣ Restar monedas
        const deductAmount = 50;
        res = await fetch(`${API}/wallet/deduct`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${JWT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: deductAmount })
        });
        data = await res.json();
        console.log(`Deducted ${deductAmount} coins:`, data);

    } catch (err) {
        console.error('WALLET ERROR:', err.message);
    }

    console.log('=== WALLET TEST COMPLETED ===');
}

run();