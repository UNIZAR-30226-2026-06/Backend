const db = require('../../database');
const NUM_MAX_JUGADORES_PARTIDA_PUBLICA=4;

async function buscar_partida_publica_unirse() {
    const [rows] = await db.query('SELECT id_partida FROM PARTIDA WHERE estado=esperando jugadores', [newUser.nombre_usuario, newUser.contrasena, newUser.correo]);
    return rows[0].id_partida;
}

async function unirse_partida_validacion(id_partida, id_usuario) {
    //comprobar que todavia haya hueco para unirse a la partida
    const [rows] = await db.query('SELECT COUNT(*) AS jugadores FROM USUARIO_EN_PARTIDA WHERE id_partida=?', [id_partida]);
    const [rows1] = await db.query('SELECT  estado FROM PARTIDA WHERE id_partida=?', [id_partida]);     
    if (rows1[0].estado!="esperando jugadores") {
        throw new Error("Partida ya iniciada, no es posible unirse")
    }
    if (rows.jugadores < NUM_MAX_JUGADORES_PARTIDA_PUBLICA && rows.jugadores>0) {   //al menos hay un jugador, el que ha creado la partida, sino entra en el if 2 opciones: partida no existe o partida completa
        //hay hueco, se une a la partida
        const [rows] = await db.query('INSERT INTO USUARIO_EN_PARTIDA (id_usuario, id_partida) VALUES (?,?)', [id_usuario, id_partida]);
        return rows.insertId    //devuelve el id_partidaUsuario
    } else {
        throw new Error("Partida completa o no existe una partida con ese id")
    }
    return null;
}

async function abandonar_partida(id_partida, id_usuario) {
    const [rows] = await db.query('DELETE FROM USUARIO_EN_PARTIDA WHERE id_usuario=? and id_partida=?', [id_usuario, id_partida]);
    return rows   
}

async function anadir_bot_a_partida(id_partida){}


