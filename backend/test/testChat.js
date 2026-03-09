const fetch = require('node-fetch');

const API = 'http://localhost:3000';

// JWT generado por testAuth
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfdXN1YXJpbyI6InRlc3RlcjE3NzI3OTY5Njg4OTIiLCJpYXQiOjE3NzI3OTY5NjksImV4cCI6MTc3MjgwMDU2OX0.FS2sC4DZdVQXTqclTOSSKA3pFYxdnMPX8ciLwNnhncY';
async function run() {

    console.log('=== TEST CHAT MODULE ===');

    const res = await fetch(`${API}/api/v1/chat/match`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT}`
        },
        body: JSON.stringify({
            mensaje: "Hola, esto es un mensaje de prueba"
        })
    });

    try {
        const data = await res.json();
        console.log('Chat response:', data);
    } catch (err) {
        console.error('Error JSON:', err.message);
        const text = await res.text();
        console.log('Raw response:', text);
    }
}

run();