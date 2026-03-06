const axios = require('axios');

const usuario = 'gonzalo';
const password = '1234'; // pon tu contraseña real
const id_avatar = 2; // el avatar que quieres comprar

async function comprarAvatar() {
  try {
    // 1️⃣ Login automático para obtener token
    const loginRes = await axios.post('http://localhost:3000/auth/login', {
      nombre_usuario: usuario,
      password
    });
    const token = loginRes.data.token;
    console.log('Token obtenido correctamente:', token);

    // 2️⃣ Hacer la compra del avatar
    const body = { id_avatar };
    const response = await axios.post(
      'http://localhost:3000/store/purchase/avatar',
      body,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('Respuesta de la compra:', response.data);

  } catch (err) {
    if (err.response) console.error('Error del servidor:', err.response.data);
    else console.error('Error de conexión:', err.message);
  }
}

comprarAvatar();