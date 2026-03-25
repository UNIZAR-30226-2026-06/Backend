const fetch = require('node-fetch');
const { io } = require("socket.io-client");
const API = 'http://localhost:3000/api/v1';

function randomUser() {
    const r = Date.now();
    return {
        nombre_usuario: `tester${r}`,
        correo: `tester${r}@mail.com`,
        password: '1234'
    };
}

async function run() {

    const user1 = randomUser();

    const registerRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user1)
        });
    
        
    
    const registerData = await registerRes.json().catch(() => null);
    console.log("STATUS:", registerRes.status);
    console.log("RESPONSE:", registerData);


    console.log("\n=== INICIAR SESION CON USUARIO 1 ===");
    //usuario 1 inicia sesion
    const loginRes = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_usuario: user1.nombre_usuario,
            password: user1.password
        })
    });

    const loginData = await loginRes.json().catch(() => null);

    console.log("STATUS:", loginRes.status);
    console.log("RESPONSE:", loginData);

    const JWT=loginData.token;


    const socket=io("http://localhost:3000", {
        auth:{
            token: JWT
        }
    })

    socket.on(`connect`, () => {
        console.log("usuario ", user1.nombre_usuario, " conectado a socket\n")

        socket.emit(`prueba_recibida`, {
            mensaje: "prueba1",
        })

        socket.on(`respuesta`, (data) => {
            console.log("Respuesta: ", data, "\n")
            socket.disconnect() //el disconect tiene que estar dentro de un callback

        })
        //si hago socket.disconnect aqui hay error porque se procesa antes del evento respuesta, tiene que estar en el callback de un evento
        //socket.disconnect()

        
    })
    


}

run();