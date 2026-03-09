
const fetch = require('node-fetch');
const API = 'http://localhost:3000';

function randomUser() {
    const r = Date.now();
    return {
        nombre_usuario: `tester${r}`,
        correo: `tester${r}@mail.com`,
        password: '1234'
    };
}

async function run() {
    //se crean 2 usuarios random que se registraran y se enviaran solicitudes de amistad entre ellos
    const user1 = randomUser();
    const user2 = randomUser();
    user2.nombre_usuario=user2.nombre_usuario+`1`;       //para diferenciar user1 y user 2
    user2.correo=user2.correo+`es`;

    

    console.log("USUARIO 1:", user1);
    console.log("USUARIO 2:", user2);

    console.log("\n=== REGISTRAR 2 USUARIOS ===");
    
    const registerRes = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user1)
    });

    

    const registerData = await registerRes.json().catch(() => null);
    console.log("STATUS:", registerRes.status);
    console.log("RESPONSE:", registerData);

    const registerRes2 = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user2)
    });

    const registerData2 = await registerRes2.json().catch(() => null);



  

    console.log("STATUS:", registerRes2.status);
    console.log("RESPONSE:", registerData2);

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
    
    
    const JWT=loginData.token;     //se almacena el token obtenido al iniciar sesion y que almacena el middleware de autenticacion

    console.log("\n=== FRIENDS TEST ===");
    //se envia solicitud de amistad a usuario 2, (lo envia usuario 1, lo datos de usuario 1 se obtienen con JWT)
    
    console.log("nombre usuario 2: "+registerData2.user.nombre_usuario+"\n");

    const invitacionAmistad = await fetch(`${API}/friends/request/`+registerData2.user.nombre_usuario, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT}`
         },
        
    });

    const amistadData = await invitacionAmistad.json().catch(() => null);

    console.log("STATUS:", invitacionAmistad.status);
    console.log("RESPONSE:", amistadData);

    //se intenta aceptar la solicitud de amistad por el mismo
    console.log("\nintenta aceptar solucion de amistad, tiene que dar error");
    const aceptarSolicitudAmistad2 = await fetch(`${API}/friends/request/`+registerData2.user.nombre_usuario + `/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT}`
         },
        
    });
    const aceptarSolicitudAmistad2Data = await aceptarSolicitudAmistad2.json().catch(() => null);
    console.log("STATUS:", aceptarSolicitudAmistad2.status);
    console.log("RESPONSE:", aceptarSolicitudAmistad2Data);


    //usuario 2 inicia sesion, muestra las solicitudes pendientes y acepta la solicitud
    console.log("\n=== INICIAR SESION CON USUARIO 2 ===");
    //usuario 1 inicia sesion
    const loginRes2 = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_usuario: user2.nombre_usuario,
            password: user2.password
        })
    });

    const loginData2 = await loginRes2.json().catch(() => null);

    console.log("STATUS:", loginRes2.status);
    console.log("RESPONSE:", loginData2);
    
    
    const JWT2=loginData2.token     //se almacena el token obtenido al iniciar sesion y que almacena el middleware de autenticacion

    console.log("\n=== FRIENDS TEST ===");

    //se muestran las solicitudes de amistad pendientes de responder, 
    console.log("\nSolicitudes de amistad de usuario2 pendientes de responder");
    const SolicitudesAmistadPendientes = await fetch(`${API}/friends/request/pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT2}`
         },
        
    });

    const solicitudesPendientesData = await SolicitudesAmistadPendientes.json().catch(() => null);

    console.log("STATUS:", SolicitudesAmistadPendientes.status);
    console.log("RESPONSE:", solicitudesPendientesData);



    //se acepta la solicitud de amistad enviada por usuario 1
    console.log("\nacepta solucion de amistad");
    const aceptarSolicitudAmistad = await fetch(`${API}/friends/request/`+registerData.user.nombre_usuario + `/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT2}`
         },
        
    });

    const aceptarSolicitudAmistadData = await aceptarSolicitudAmistad.json().catch(() => null);

    console.log("STATUS:", aceptarSolicitudAmistad.status);
    console.log("RESPONSE:", aceptarSolicitudAmistadData);

    //se muestran los amigos de Usuario 1 y Usuario 2, se todo ha ido bien tendrian que aparecerse ellos mismos
    console.log("\nAmigos de Usuario 1 ")
    const amigos1 = await fetch(`${API}/friends` , {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT}`
         },
        
    });

    const amigos1Data = await amigos1.json().catch(() => null);

    console.log("STATUS:", amigos1.status);
    console.log("RESPONSE:", amigos1Data);

    console.log("\nAmigos de Usuario 2 ")
    const amigos2 = await fetch(`${API}/friends` , {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT2}`
         },
        
    });

    const amigos2Data = await amigos2.json().catch(() => null);

    console.log("STATUS:", amigos2.status);
    console.log("RESPONSE:", amigos2Data);

    //elimiar amigo
    console.log("\nSe eliminas los amigos creados ")
    const amigosEliminar = await fetch(`${API}/friends/`+registerData.user.nombre_usuario , {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT2}`
         },
        
    });

    const amigosEliminarData = await amigosEliminar.json().catch(() => null);

    console.log("STATUS:", amigosEliminar.status);
    console.log("RESPONSE:", amigosEliminarData);

    //se muestran los amigos de Usuario 1 y Usuario 2, si todo ha ido bien tendria que aparecer vacio
    console.log("\nAmigos de Usuario 1 ")
    const amigos1_1 = await fetch(`${API}/friends` , {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT}`
         },
        
    });

    const amigos1Data_1 = await amigos1_1.json().catch(() => null);

    console.log("STATUS:", amigos1_1.status);
    console.log("RESPONSE:", amigos1Data_1);

    console.log("\nAmigos de Usuario 2 ")
    const amigos2_1 = await fetch(`${API}/friends` , {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT2}`
         },
        
    });

    const amigos2Data_1 = await amigos2_1.json().catch(() => null);

    console.log("STATUS:", amigos2_1.status);
    console.log("RESPONSE:", amigos2Data_1);


    const user3 = randomUser();
    user3.nombre_usuario=user3.nombre_usuario+`3`;       //para diferenciar usuarios
    user3.correo=user3.correo+`ess`;
    const user4 = randomUser();
    user4.nombre_usuario=user4.nombre_usuario+`4`;       //para diferenciar usuarios
    user4.correo=user4.correo+`esss`;

    //registro los 2 nuevos usuarios
    console.log("\nregistro usuarios 3 y 4");
    const registerRes3 = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user3)
    });

    

    const registerData3 = await registerRes3.json().catch(() => null);
    console.log("STATUS:", registerRes3.status);
    console.log("RESPONSE:", registerData3);

    const registerRes4 = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user4)
    });

    

    const registerData4 = await registerRes4.json().catch(() => null);
    console.log("STATUS:", registerRes4.status);
    console.log("RESPONSE:", registerData4);


    console.log("\n=== INICIAR SESION CON USUARIO 3 ===");
    //usuario 1 inicia sesion
    const loginRes3 = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_usuario: user3.nombre_usuario,
            password: user3.password
        })
    });

    const loginData3 = await loginRes3.json().catch(() => null);

    console.log("STATUS:", loginRes3.status);
    console.log("RESPONSE:", loginData3);
    
    
    const JWT3=loginData3.token;     //se almacena el token obtenido al iniciar sesion y que almacena el middleware de autenticacion
    
    //envio solicitud de amistad a usuario 4
    console.log("\nusuario 3 envia solicitud de amistad a usuario 4");
    const invitacionAmistad2 = await fetch(`${API}/friends/request/`+registerData4.user.nombre_usuario, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT3}`
         },
        
    });

    const amistadData2 = await invitacionAmistad2.json().catch(() => null);

    console.log("STATUS:", invitacionAmistad2.status);
    console.log("RESPONSE:", amistadData2);

    console.log("\nusuario 3 consulta las solicitudes enviadas pendientes de recibir respuesta");
    const enviadas = await fetch(`${API}/friends/request/sending/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT3}`
         },
    });

    const enviadasdData = await enviadas.json().catch(() => null);

    console.log("STATUS:", enviadas.status);
    console.log("RESPONSE:", enviadasdData);

    //usuario 4 inicia sesion
    console.log("\n=== INICIAR SESION CON USUARIO 4 ===");
    //usuario 4 inicia sesion
    const loginRes4 = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_usuario: user4.nombre_usuario,
            password: user4.password
        })
    });

    const loginData4 = await loginRes4.json().catch(() => null);

    console.log("STATUS:", loginRes4.status);
    console.log("RESPONSE:", loginData4);
    
    const JWT4=loginData4.token;     //se almacena el token obtenido al iniciar sesion y que almacena el middleware de autenticacion
    


    console.log("\nSolicitudes de amistad de usuario4 pendientes de responder");
    const SolicitudesAmistadPendientes2 = await fetch(`${API}/friends/request/pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });

    const solicitudesPendientesData2= await SolicitudesAmistadPendientes2.json().catch(() => null);

    console.log("STATUS:", SolicitudesAmistadPendientes2.status);
    console.log("RESPONSE:", solicitudesPendientesData2);


    


   

    console.log("\nusuario 3 cancela la solicitud de amistad enviada a usuario 4");
    const invitacionAmistad2cancelar = await fetch(`${API}/friends/request/`+registerData4.user.nombre_usuario, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT3}`
         },
        
    });

    const invitacionAmistad2cancelarData = await invitacionAmistad2cancelar.json().catch(() => null);

    console.log("STATUS:", invitacionAmistad2.status);
    console.log("RESPONSE:", invitacionAmistad2cancelarData);


     console.log("\nSolicitudes de amistad enviadas por usuario 3");
    const enviadasSol = await fetch(`${API}/friends/request/sending/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT3}`
         },
    });

    const enviadasData = await enviadasSol.json().catch(() => null);

    console.log("STATUS:", enviadasSol.status);
    console.log("RESPONSE:", enviadasData);

    


    console.log("\nSolicitudes de amistad de usuario4 pendientes de responder");
    const SolicitudesAmistadPendientes3 = await fetch(`${API}/friends/request/pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });

    const solicitudesPendientesData3= await SolicitudesAmistadPendientes3.json().catch(() => null);

    console.log("STATUS:", SolicitudesAmistadPendientes3.status);
    console.log("RESPONSE:", solicitudesPendientesData3);


    //envio solicitud de amistad a usuario 4
    console.log("\nusuario 3 vuelve a enviar solicitud de amistad a usuario 4");
    const invitacionAmistad3 = await fetch(`${API}/friends/request/`+registerData4.user.nombre_usuario, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT3}`
         },
        
    });

    const amistadData3 = await invitacionAmistad3.json().catch(() => null);

    console.log("STATUS:", invitacionAmistad3.status);
    console.log("RESPONSE:", amistadData3);

    console.log("\nSolicitudes de amistad de usuario4 pendientes de responder");
    const SolicitudesAmistadPendientes4 = await fetch(`${API}/friends/request/pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });

    const solicitudesPendientesData4= await SolicitudesAmistadPendientes4.json().catch(() => null);

    console.log("STATUS:", SolicitudesAmistadPendientes4.status);
    console.log("RESPONSE:", solicitudesPendientesData4);


    
    console.log("\nusuario 4 rechaza la solicitud de amistad de usuario 3");
    const rechazarSolicitud = await fetch(`${API}/friends/request/`+registerData3.user.nombre_usuario + `/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });
    const rechazarSolicitudData = await rechazarSolicitud.json().catch(() => null);

    console.log("STATUS:", rechazarSolicitud.status);
    console.log("RESPONSE:", rechazarSolicitudData);

    console.log("\nSolicitudes de amistad de usuario4 pendientes de responder");
    const SolicitudesAmistadPendientes5 = await fetch(`${API}/friends/request/pending`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });

    const solicitudesPendientesData5= await SolicitudesAmistadPendientes5.json().catch(() => null);

    console.log("STATUS:", SolicitudesAmistadPendientes5.status);
    console.log("RESPONSE:", solicitudesPendientesData5);



    console.log("\nUsuario 4 busca usuarios que contengan la cadena 'tester'");
    const busqueda = await fetch(`${API}/friends/search/` + `tester`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT4}`
         },
        
    });

    const busquedaData= await busqueda.json().catch(() => null);

    console.log("STATUS:", busqueda.status);
    console.log("RESPONSE:", busquedaData);

    


    






}

run();
