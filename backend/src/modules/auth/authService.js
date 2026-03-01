// ================= AUTH SERVICE =================
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function loginUser(nombre_usuario, password) {
    const result = await db.query(
        'SELECT * FROM notuno.USUARIO WHERE nombre_usuario = $1',
        [nombre_usuario]
    );
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const valid = await comparePassword(password, user.contrasena);
    if (!valid) return null;

    return user;
}

function generateToken(user) {
    return jwt.sign(
        { nombre_usuario: user.nombre_usuario }, // <--- solo nombre_usuario
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
}

// ================= MODIFICADO PARA OPCIÓN A =================
async function getUserByUsername(nombre_usuario) {
    const result = await db.query(
        'SELECT nombre_usuario, correo, id_avatar_seleccionado, id_estilo_seleccionado FROM notuno.USUARIO WHERE nombre_usuario = $1',
        [nombre_usuario]
    );
    return result.rows[0] || null;
}

async function comprobarContraseñaActualCorrecta(nombre_usuario, contrasena_actual) {
    const result = await db.query(
        'SELECT contrasena FROM notuno.USUARIO WHERE nombre_usuario = $1',
        [nombre_usuario]
    );
    if (result.rows.length > 0) {
        const contrasenaAlmacenada = result.rows[0].contrasena;
        return await comparePassword(contrasena_actual, contrasenaAlmacenada);
    }
    return false;
}

module.exports = {
    hashPassword,
    comparePassword,
    loginUser,
    generateToken,
    getUserByUsername, // <--- usamos este
    comprobarContraseñaActualCorrecta
};