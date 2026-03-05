const bcrypt = require('bcrypt');
const db = require('../../config/db');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

async function loginUser(nombre_usuario, password) {
    const result = await db.query(
        'SELECT * FROM notuno.USUARIO WHERE nombre_usuario=$1',
        [nombre_usuario]
    );
    if (!result.rows.length) return null;

    const user = result.rows[0];
    const valid = await comparePassword(password, user.contrasena);
    if (!valid) return null;

    return user;
}

function generateToken(user) {
    return jwt.sign(
        { nombre_usuario: user.nombre_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

async function getUserByUsername(nombre_usuario) {
    const result = await db.query(
        'SELECT nombre_usuario, correo, id_avatar_seleccionado, id_estilo_seleccionado FROM notuno.USUARIO WHERE nombre_usuario=$1',
        [nombre_usuario]
    );
    return result.rows[0] || null;
}

async function comprobarContraseñaActualCorrecta(nombre_usuario, contrasena_actual) {
    const result = await db.query(
        'SELECT contrasena FROM notuno.USUARIO WHERE nombre_usuario=$1',
        [nombre_usuario]
    );
    if (!result.rows.length) return false;
    return comparePassword(contrasena_actual, result.rows[0].contrasena);
}

module.exports = {
    hashPassword,
    comparePassword,
    loginUser,
    generateToken,
    getUserByUsername,
    comprobarContraseñaActualCorrecta
};