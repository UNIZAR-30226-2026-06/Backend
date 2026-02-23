const bcrypt = require('bcrypt');

async function hashPassword(password) {
    //funcion para hashear una contraseña utilizando bcrypt
    const saltRounds = 10; // Número de rondas de sal para aumentar la seguridad
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    //funcion para comparar una contraseña sin hashear (la que llega del login) con su versión hasheada
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // Devuelve true si las contraseñas coinciden, false en caso contrario
}

async function authenticateUser(nombre_usuario, password) {
    //funcion para autenticar a un usuario comparando la contraseña ingresada con la almacenada en la base de datos
    const [rows] = await db.query('SELECT contrasena FROM users WHERE nombre_usuario = ?', [nombre_usuario]);
    if (rows.length > 0) {
        const hashedPassword = rows[0].contrasena;
        return await comparePassword(password, hashedPassword);
    }
    return false;
}

//funciones para cambiar contraseña
async function comprobarContraseñaActualCorrecta(nombre_usuario, contrasena_actual) {
    const [rows] = await db.query('SELECT contrasena FROM users WHERE nombre_usuario = ?', [nombre_usuario]);
    if (rows.length > 0) {
        const contrasenaAlmacenada = rows[0].contrasena;
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