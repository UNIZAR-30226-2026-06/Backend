
const db = require('../../config/db');

class User {
    //almacena la informacion de un usuario y contiene las funciones de puede realizar
    constructor (nombre_usuario, contrasena, correo, monedas, total_ganadas, total_partidas, numero_amigos, numero_solicitudes, id_avatar_seleccionado, id_estilo_seleccionado){
        this.nombre_usuario = nombre_usuario;
        this.contrasena = contrasena;
        this.correo = correo;
        this.monedas = monedas;
        this.total_ganadas = total_ganadas;
        this.total_partidas = total_partidas;
        this.numero_amigos = numero_amigos;
        this.numero_solicitudes = numero_solicitudes;
        this.id_avatar_seleccionado = id_avatar_seleccionado;
        this.id_estilo_seleccionado = id_estilo_seleccionado;
    }
    
    
}

async function createUser(nombre_usuario, contrasena, correo) {
    //funcion para crear un nuevo usuario y guardarlo en la base de datos
    const newUser = new User(nombre_usuario, contrasena, correo, 0, 0, 0, 0, 0, null, null);
    const [result] = await db.query('INSERT INTO USUARIO (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)', [newUser.nombre_usuario, newUser.contrasena, newUser.correo]);
    return result.insertId; // Devuelve el ID del nuevo usuario creado

}

async function getUserByUsername(nombre_usuario) {
    //funcion para obtener un usuario por su nombre de usuario
    const [rows] = await db.query('SELECT * FROM USUARIO WHERE nombre_usuario = ?', [nombre_usuario]);
    if (rows.length > 0) {
        const userData = rows[0];
        //por seguridad no se devuelve la contraseña del usuario
        return new User(userData.nombre_usuario, null, userData.correo, userData.monedas, userData.total_ganadas, userData.total_partidas, userData.numero_amigos, userData.numero_solicitudes, userData.id_avatar_seleccionado, userData.id_estilo_seleccionado);
    }
    return null;
}

async function getUserByEmail(correo) {
    //funcion para obtener un usuario por su correo electronico
    const [rows] = await db.query('SELECT * FROM USUARIO WHERE correo = ?', [correo]);
    if (rows.length > 0) {
        const userData = rows[0];
        //por seguridad no se devuelve la contraseña del usuario
        return new User(userData.nombre_usuario, null, userData.correo, userData.monedas, userData.total_ganadas, userData.total_partidas, userData.numero_amigos, userData.numero_solicitudes, userData.id_avatar_seleccionado, userData.id_estilo_seleccionado);
    }
    return null;
}

async function updateUser(user) {
    //funcion para actualizar la informacion de un usuario en la base de datos, excepto contraseña por seguridad
    await db.query('UPDATE USUARIO SET correo = ?, monedas = ?, total_ganadas = ?, total_partidas = ?, numero_amigos = ?, numero_solicitudes = ?, id_avatar_seleccionado = ?, id_estilo_seleccionado = ? WHERE nombre_usuario = ?', [ user.correo, user.monedas, user.total_ganadas, user.total_partidas, user.numero_amigos, user.numero_solicitudes, user.id_avatar_seleccionado, user.id_estilo_seleccionado, user.nombre_usuario]);
}

async function updateUserPassword(nombre_usuario, newPassword) {
    //funcion para actualizar la contraseña de un usuario en la base de datos
    await db.query('UPDATE USUARIO SET contrasena = ? WHERE nombre_usuario = ?', [newPassword, nombre_usuario]);
}

async function deleteUser(nombre_usuario) {
    //funcion para eliminar un usuario de la base de datos
    await db.query('DELETE FROM USUARIO WHERE nombre_usuario = ?', [nombre_usuario]);
}


//metodos para obtener y actualizar campos específicos de un usuario por su id, se pueden usar para actualizar solo un campo sin necesidad de actualizar todo el usuario
async function setnombre_usuarioById(id, nombre_usuario) {
    const [result] = await db.query('UPDATE USUARIO SET nombre_usuario = ? WHERE nombre_usuario = ?', [nombre_usuario, id]);
    return result;
}

async function setCorreoById(id, correo) {
    const [result] = await db.query('UPDATE USUARIO SET correo = ? WHERE nombre_usuario = ?', [correo, id]);
    return result;
}

async function setMonedasById(id, monedas) {
    const [result] = await db.query('UPDATE USUARIO SET monedas = ? WHERE nombre_usuario = ?', [monedas, id]);
    return result;
}

async function setTotalGanadasById(id, total_ganadas) {
    const [result] = await db.query('UPDATE USUARIO SET total_ganadas = ? WHERE nombre_usuario = ?', [total_ganadas, id]);
    return result;
}   

async function anadirPartidaGanada_ById(id) {
    const [result] = await db.query('SELECT total_ganadas FROM USUARIO WHERE nombre_usuario = ?', [id]);
   
    const [result1] = await db.query('UPDATE USUARIO SET (total_ganadas = ?) WHERE nombre_usuario = ?', [result[0].total_ganadas+1, id]);
    return result;
}  

async function setTotalPartidasById(id, total_partidas) {
    const [result] = await db.query('UPDATE USUARIO SET total_partidas = ? WHERE nombre_usuario = ?', [total_partidas, id]);
    return result;
}

async function anadir_Partida_jugada_ById(id) {
    const [result] = await db.query('SELECT  total_partidas FROM USUARIO WHERE nombre_usuario = ?', [id]);
   
    const [result1] = await db.query('UPDATE USUARIO SET total_partidas=? WHERE nombre_usuario = ?', [result[0].total_ganadas+1, id]);
    return result;
}

async function setNumeroAmigosById(id, numero_amigos) {
    const [result] = await db.query('UPDATE USUARIO SET numero_amigos = ? WHERE nombre_usuario = ?', [numero_amigos, id]);
    return result;
}   
async function setNumeroSolicitudesById(id, numero_solicitudes) {
    const [result] = await db.query('UPDATE USUARIO SET numero_solicitudes = ? WHERE nombre_usuario = ?', [numero_solicitudes, id]);
    return result;
}
async function setIdAvatarSeleccionadoById(id, id_avatar_seleccionado) {
    const [result] = await db.query('UPDATE USUARIO SET id_avatar_seleccionado = ? WHERE nombre_usuario = ?', [id_avatar_seleccionado, id]);
    return result;
}
async function setIdEstiloSeleccionadoById(id, id_estilo_seleccionado) {
    const [result] = await db.query('UPDATE USUARIO SET id_estilo_seleccionado = ? WHERE nombre_usuario = ?', [id_estilo_seleccionado, id]);
    return result;
}

async function getNombre_usuarioById(id) {
    const [rows] = await db.query('SELECT nombre_usuario FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].nombre_usuario ;
}

async function getCorreoById(id) {
    const [rows] = await db.query('SELECT correo FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].correo;
}

async function getMonedasById(id) {
    const [rows] = await db.query('SELECT monedas FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].monedas ;
}

async function getTotalGanadasById(id) {
    const [rows] = await db.query('SELECT total_ganadas FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].total_ganadas ;
}

async function getTotalPartidasById(id) {
    const [rows] = await db.query('SELECT total_partidas FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].total_partidas;
}

async function getNumeroAmigosById(id) {
    const [rows] = await db.query('SELECT numero_amigos FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].numero_amigos;
}

async function getNumeroSolicitudesById(id) {
    const [rows] = await db.query('SELECT numero_solicitudes FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].numero_solicitudes;
}

async function getIdAvatarSeleccionadoById(id) {
    const [rows] = await db.query('SELECT id_avatar_seleccionado FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].id_avatar_seleccionado;
}

async function getIdEstiloSeleccionadoById(id) {
    const [rows] = await db.query('SELECT id_estilo_seleccionado FROM USUARIO WHERE nombre_usuario = ?', [id]);
    return rows[0].id_estilo_seleccionado;
}


async function existeUsuario(nombre_usuario) {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM USUARIO WHERE nombre_usuario = ?', [nombre_usuario]);
    return rows[0].count > 0;
}



module.exports = { User, createUser, getUserByUsername, getUserByEmail, updateUser, updateUserPassword, deleteUser, 
                    setnombre_usuarioById, setCorreoById, setMonedasById, setTotalGanadasById, setTotalPartidasById, 
                    setNumeroAmigosById, setNumeroSolicitudesById, setIdAvatarSeleccionadoById, setIdEstiloSeleccionadoById,
                    existeUsuario, getCorreoById, getNumeroSolicitudesById, getIdAvatarSeleccionadoById, getIdEstiloSeleccionadoById,
                    getNumeroAmigosById, getNombre_usuarioById, getTotalGanadasById, getTotalPartidasById, getMonedasById, 
                    anadir_Partida_jugada_ById, anadirPartidaGanada_ById};