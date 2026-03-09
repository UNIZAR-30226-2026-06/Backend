// testComprarAvatar.js
const axios = require('axios');

const API = 'http://localhost:3000/api/v1';
const usuario = 'gonzalo';   // reemplaza por tu usuario real
const password = '1234';      // reemplaza por tu contraseña real
const idAvatar = 2;           // avatar que quieres comprar

async function comprarAvatar() {
  try {
    // 1️⃣ Login para obtener token
    const loginRes = await axios.post(`${API}/auth/login`, {
      nombre_usuario: usuario,
      password
    });

    const token = loginRes.data.token;
    if (!token) throw new Error('No se recibió token del login');

    console.log('Token obtenido correctamente:', token);

    // 2️⃣ Hacer la compra del avatar
    const body = { id_avatar: idAvatar };
    const purchaseRes = await axios.post(
      `${API}/store/purchase/avatar`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Respuesta de la compra:', purchaseRes.data);

  } catch (err) {
    if (err.response) {
      console.error('Error del servidor:', err.response.data);
    } else {
      console.error('Error de conexión o interno:', err.message);
    }
  }
}

comprarAvatar();