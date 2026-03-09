// testComprarEstilo.js
const axios = require('axios');

const API = 'http://localhost:3000/api/v1';

const username = 'gonzalo';   // reemplaza por tu usuario real
const password = '1234';       // reemplaza por tu contraseña real
const idEstilo = 2;            // id del estilo a comprar

async function testComprarEstilo() {
  try {
    // 1️⃣ Login para obtener token
    const loginResponse = await axios.post(`${API}/auth/login`, {
      nombre_usuario: username,
      password: password
    });

    const token = loginResponse.data.token;
    if (!token) throw new Error('No se recibió token del login');

    console.log('Token obtenido correctamente:', token);

    // 2️⃣ Preparar el body de la compra
    const body = { id_estilo: idEstilo };

    // 3️⃣ Hacer la compra usando el token
    const purchaseResponse = await axios.post(
      `${API}/store/purchase/estilo`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Respuesta de la compra:', purchaseResponse.data);

  } catch (err) {
    if (err.response) {
      console.error('Error del servidor:', err.response.data);
    } else {
      console.error('Error de conexión o interno:', err.message);
    }
  }
}

testComprarEstilo();