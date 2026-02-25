const bcrypt = require('bcrypt');
const db = require('../../config/db');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function authenticateUser(nombre_usuario, password) {
    const result = await db.query(
        'SELECT contrasena FROM notuno.USUARIO WHERE nombre_usuario = $1',
        [nombre_usuario]
    );

    if (result.rows.length > 0) {
        const hashedPassword = result.rows[0].contrasena;
        return await comparePassword(password, hashedPassword);
    }
    return false;
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
    authenticateUser,
    comprobarContraseñaActualCorrecta
};