// testComprarEstilo.js
const axios = require('axios');

async function testComprarEstilo() {
  try {
    // 1️⃣ Hacer login para obtener token
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      nombre_usuario: 'gonzalo',   // reemplaza por tu usuario real
      password: '1234'     // reemplaza por tu contraseña real
    });

    const token = loginResponse.data.token;
    if (!token) throw new Error('No se recibió token del login');

    console.log('Token obtenido correctamente:', token);

    // 2️⃣ Preparar el body del estilo a comprar
    const body = {
      id_estilo: 2 // el id del estilo que quieres comprar
    };

    // 3️⃣ Hacer la compra usando el token obtenido
    const purchaseResponse = await axios.post(
      'http://localhost:3000/store/purchase/estilo',
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
      console.error('Error de conexión:', err.message);
    }
  }
}

testComprarEstilo();