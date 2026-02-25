const db = require('../../database');
const user = require('../../modules/user/userService.js');

const NUM_MAX_JUGADORES_PARTIDA_PUBLICA=4;

async function buscar_partida_publica_unirse() {
    const [rows] = await db.query('SELECT id_partida FROM PARTIDA WHERE estado=$1', ["esperando jugadores"]);
    
    if (!rows.length) {
        //no hay ninguna partida en estado esperando jugadores, se crea una nueva partida
        //se crea partida nueva con configuracion estandar
        configuracion_partida=new gamestate()   //crea partida por defecto
        return crear_partida(config_partida);
    }
    return rows[0].id_partida;
}

async function unirse_partida_validacion(id_partida, id_usuario) {
    try {
        await db.query('BEGIN');    //para que se ejecute atomicamente y 2 jugadores no la puedan ejecutar a la vez
        //comprobar que todavia haya hueco para unirse a la partida
        const [rows] = await db.query('SELECT COUNT(*) AS jugadores  FROM USUARIO_EN_PARTIDA WHERE id_partida=$1', [id_partida]);
        const [rows1] = await db.query('SELECT  estado, max_jugadores FROM PARTIDA WHERE id_partida=$1', [id_partida]);     
        if (rows1[0].estado!="esperando jugadores") {
            throw new Error("Partida ya iniciada, no es posible unirse")
        }
        if (rows[0].jugadores <= rows1[0].max_jugadores && rows.jugadores>0) {   //al menos hay un jugador, el que ha creado la partida, sino entra en el if 2 opciones: partida no existe o partida completa
            //hay hueco, se une a la partida
            const [result] = await db.query('INSERT INTO USUARIO_EN_PARTIDA (id_usuario, id_partida) VALUES ($1,$2) RETURNING id_partidaUsuario', [id_usuario, id_partida]);
            await client.query('COMMIT');
            return result.rows[0].id_partidaUsuario;    //devuelve el id_partidaUsuario
            
        } else {
            throw new Error("Partida completa o no existe una partida con ese id")
        }
        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }

    return null;
}

async function abandonar_partida(id_partida, id_usuario) {
    const [rows] = await db.query('DELETE FROM USUARIO_EN_PARTIDA WHERE id_usuario=$1 and id_partida=$2', [id_usuario, id_partida]);
    return rows   
}

async function anadir_bot_a_partida(id_partida){}

async function crear_partida(config_partida) {
    const [result] = await db.query('INSERT INTO PARTIDA (num_cartas_inicio, modo_cartas_especiales, modo_roles, sonido, musica, vibracion, estado, timeout_turno, max_jugadores, partida_publica) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id_partida', 
                                [config_partida.getNumCartasInicio(), config_partida.getModoCartasEspeciales(), config_partida.getModoRoles(), config_partida.getSonido(), config_partida.getMusica(), config_partida.getVibracion(), config_partida.getEstado(), config_partida.getTimeoutTurno(), config_partida.getMaxJugadores(), config_partida.getPartidaPublica()]);
    
    return result.rows[0].id_partida;
}

async function iniciar_partida(id_partida) {
    
    const [rows] = await db.query('UPDATE PARTIDA SET estado = $1 WHERE id_partida = $2', ["en curso", id_partida]);
    return rows;
}

async function pausar_partida(id_partida) {
    
    const [rows] = await db.query('UPDATE PARTIDA SET estado = $1 WHERE id_partida = $2', ["pausada", id_partida]);
    return rows;
}

async function terminar_partida(id_partida, nombre_user_ganador) {
    const [rows_usuarios_partida] = await db.query('SELECT id_usuario FROM USUARIO_EN_PARTIDA WHERE id_partida = $1', [id_partida]);
    //incrementar partidas jugadas
    for (i of rows_usuarios_partida) {
        await user.anadir_Partida_jugada_ById(i.id_usuario);
    }
    await user.anadirPartidaGanada_ById(nombre_user_ganador);
    const [rows1] = await db.query('DELETE FROM USUARIO_EN_PARTIDA WHERE id_partida = $1', [id_partida]);
    const [rows] = await db.query('DELETE FROM PARTIDA WHERE id_partida = $1', [id_partida]);
    
    return rows;
}



