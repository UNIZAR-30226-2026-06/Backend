const db = require('../../config/db');

class User {
    constructor(nombre_usuario, contrasena, correo, monedas, total_ganadas, total_partidas, id_avatar_seleccionado, id_estilo_seleccionado) {
        this.nombre_usuario = nombre_usuario;
        this.contrasena = contrasena;
        this.correo = correo;
        this.monedas = monedas;
        this.total_ganadas = total_ganadas;
        this.total_partidas = total_partidas;
        this.id_avatar_seleccionado = id_avatar_seleccionado;
        this.id_estilo_seleccionado = id_estilo_seleccionado;
    }
}

// ================= CREAR USUARIO =================
async function createUser(nombre_usuario, contrasena, correo) {
    const result = await db.query(
        'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3)',
        [nombre_usuario, contrasena, correo]
    );
    return result.rowCount === 1;
}

// ================= OBTENER USUARIO =================
async function getUserByUsername(nombre_usuario) {
    const result = await db.query(
        'SELECT * FROM notuno.USUARIO WHERE nombre_usuario = $1',
        [nombre_usuario]
    );
    if (result.rows.length > 0) {
        const u = result.rows[0];
        return new User(u.nombre_usuario, null, u.correo, u.monedas, u.total_ganadas, u.total_partidas, u.id_avatar_seleccionado, u.id_estilo_seleccionado);
    }
    return null;
}

async function getUserByEmail(correo) {
    const result = await db.query(
        'SELECT * FROM notuno.USUARIO WHERE correo = $1',
        [correo]
    );
    if (result.rows.length > 0) {
        const u = result.rows[0];
        return new User(u.nombre_usuario, null, u.correo, u.monedas, u.total_ganadas, u.total_partidas, u.id_avatar_seleccionado, u.id_estilo_seleccionado);
    }
    return null;
}

// ================= ACTUALIZAR USUARIO =================
async function updateUser(user) {
    await db.query(
        `UPDATE notuno.USUARIO SET correo=$1, monedas=$2, total_ganadas=$3, total_partidas=$4,
         id_avatar_seleccionado=$5, id_estilo_seleccionado=$6 WHERE nombre_usuario=$7`,
        [user.correo, user.monedas, user.total_ganadas, user.total_partidas, user.id_avatar_seleccionado, user.id_estilo_seleccionado, user.nombre_usuario]
    );
}

async function updateUserPassword(nombre_usuario, newPassword) {
    await db.query('UPDATE notuno.USUARIO SET contrasena=$1 WHERE nombre_usuario=$2', [newPassword, nombre_usuario]);
}

// ================= ELIMINAR USUARIO =================
async function deleteUser(nombre_usuario) {
    await db.query('DELETE FROM notuno.USUARIO WHERE nombre_usuario=$1', [nombre_usuario]);
}

// ================= MÉTODOS POR CAMPO =================
async function setCorreoById(id, correo) {
    const result = await db.query('UPDATE notuno.USUARIO SET correo=$1 WHERE nombre_usuario=$2', [correo, id]);
    return result.rowCount === 1;
}

async function setIdAvatarSeleccionadoById(id, id_avatar_seleccionado) {
    const result = await db.query('UPDATE notuno.USUARIO SET id_avatar_seleccionado=$1 WHERE nombre_usuario=$2', [id_avatar_seleccionado, id]);
    return result.rowCount === 1;
}

async function setIdEstiloSeleccionadoById(id, id_estilo_seleccionado) {
    const result = await db.query('UPDATE notuno.USUARIO SET id_estilo_seleccionado=$1 WHERE nombre_usuario=$2', [id_estilo_seleccionado, id]);
    return result.rowCount === 1;
}

// ================= LECTURA POR CAMPO =================
async function getNombreUsuarioById(id) {
    const result = await db.query('SELECT nombre_usuario FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.nombre_usuario;
}

async function getCorreoById(id) {
    const result = await db.query('SELECT correo FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.correo;
}

async function getIdAvatarSeleccionadoById(id) {
    const result = await db.query('SELECT id_avatar_seleccionado FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.id_avatar_seleccionado;
}

async function getIdEstiloSeleccionadoById(id) {
    const result = await db.query('SELECT id_estilo_seleccionado FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.id_estilo_seleccionado;
}

async function getMonedasById(id) {
    const result = await db.query('SELECT monedas FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.monedas;
}

async function getTotalGanadasById(id) {
    const result = await db.query('SELECT total_ganadas FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.total_ganadas;
}

async function getTotalPartidasById(id) {
    const result = await db.query('SELECT total_partidas FROM notuno.USUARIO WHERE nombre_usuario=$1', [id]);
    return result.rows[0]?.total_partidas;
}

async function anadirPartidaGanadaById(id) {
    const result = await db.query('UPDATE notuno.USUARIO SET total_ganadas = total_ganadas + 1 WHERE nombre_usuario=$1', [id]);
    return result.rowCount === 1;
}

async function anadirPartidaJugadaById(id) {
    const result = await db.query('UPDATE notuno.USUARIO SET total_partidas = total_partidas + 1 WHERE nombre_usuario=$1', [id]);
    return result.rowCount === 1;
}

async function existeUsuario(nombre_usuario) {
    const result = await db.query('SELECT COUNT(*) AS count FROM notuno.USUARIO WHERE nombre_usuario=$1', [nombre_usuario]);
    return result.rows[0]?.count > 0;
}

async function getAvataresComprados(nombre_usuario) {
    const result = await db.query(`
        SELECT a.id_avatar, a.image, a.precioavatar
        FROM notuno.AVATAR a
        INNER JOIN notuno.AVATARES_COMPRADOS ac 
            ON a.id_avatar = ac.id_avatar
        WHERE ac.nombre_usuario = $1
    `, [nombre_usuario]);

    return result.rows;
}

async function getEstilosComprados(nombre_usuario) {
    const result = await db.query(`
        SELECT e.id_estilo, e.precioestilo
        FROM notuno.ESTILO e
        INNER JOIN notuno.ESTILOS_COMPRADOS ec 
            ON e.id_estilo = ec.id_estilo
        WHERE ec.nombre_usuario = $1
    `, [nombre_usuario]);

    return result.rows;
}

async function tieneEstilo(nombre_usuario, id_estilo) {
    const result = await db.query(`
        SELECT 1 
        FROM notuno.ESTILOS_COMPRADOS 
        WHERE nombre_usuario = $1 AND id_estilo = $2
    `, [nombre_usuario, id_estilo]);

    return result.rowCount > 0;
}

async function tieneAvatar(nombre_usuario, id_avatar) {
    const result = await db.query(`
        SELECT 1 
        FROM notuno.AVATARES_COMPRADOS 
        WHERE nombre_usuario = $1 AND id_avatar = $2
    `, [nombre_usuario, id_avatar]);

    return result.rowCount > 0;
}

async function existeAvatar(id_avatar) {
    const result = await db.query(`
        SELECT 1 
        FROM notuno.AVATAR 
        WHERE id_avatar = $1
    `, [id_avatar]);

    return result.rowCount > 0;
}

async function existeEstilo(id_estilo) {
    const result = await db.query(`
        SELECT 1 
        FROM notuno.ESTILO 
        WHERE id_estilo = $1
    `, [id_estilo]);

    return result.rowCount > 0;
}

module.exports = {
    User,
    createUser,
    getUserByUsername,
    getUserByEmail,
    updateUser,
    updateUserPassword,
    deleteUser,
    setCorreoById,
    setIdAvatarSeleccionadoById,
    setIdEstiloSeleccionadoById,
    getNombreUsuarioById,
    getCorreoById,
    getIdAvatarSeleccionadoById,
    getIdEstiloSeleccionadoById,
    getMonedasById,
    getTotalGanadasById,
    getTotalPartidasById,
    anadirPartidaGanadaById,
    anadirPartidaJugadaById,
    existeUsuario,
    getAvataresComprados,
    getEstilosComprados,
    tieneEstilo,
    tieneAvatar,
    existeAvatar,
    existeEstilo

};