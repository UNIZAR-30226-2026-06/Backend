// testRegisterLogin.js
const fetch = require('node-fetch');

const API = 'http://localhost:3000/api/v1'; // agregamos el prefijo global

function randomUser() {
  const r = Date.now();
  return {
    nombre_usuario: `tester${r}`,
    correo: `tester${r}@mail.com`,
    password: '1234'
  };
}

async function run() {
  const user = randomUser();
  console.log("USUARIO TEST:", user);

  // --------------------------
  console.log("\n=== REGISTER TEST ===");
  try {
    const registerRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    const registerData = await registerRes.json().catch(() => null);
    console.log("STATUS:", registerRes.status);
    console.log("RESPONSE:", registerData);

  } catch (err) {
    console.error("Error al registrar:", err.message);
  }

  // --------------------------
  console.log("\n=== LOGIN TEST ===");
  let token = null;
  try {
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_usuario: user.nombre_usuario,
        password: user.password
      })
    });

    const loginData = await loginRes.json().catch(() => null);
    console.log("STATUS:", loginRes.status);
    console.log("RESPONSE:", loginData);

    if (loginData?.token) {
      token = loginData.token;
      console.log("\nJWT RECIBIDO ✔", token);
    } else {
      console.log("\nJWT NO RECIBIDO ✖");
    }

  } catch (err) {
    console.error("Error al hacer login:", err.message);
  }
}

run();