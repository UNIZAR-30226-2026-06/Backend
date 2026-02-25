const db = require('../../database');

async function enviar_Solicitud_Amistad(id_sender, id_receiver) {
    //funcion para enviar una solicitud de amistad de un usuario a otro
    const result = await db.query('INSERT INTO SOLICITUD_AMISTAD (id_usuario_origen, id_usuario_destino, estado) VALUES ($1,$2,$3)', [id_sender, id_receiver, "pendiente"]);
    return result.rowCount;
}

async function eliminar_solicitud_amistad(id_sender, id_receiver) {
    //funcion para eliminar una solicitud de amistad de un usuario a otro
    const result = await db.query('DELETE FROM SOLICITUD_AMISTAD WHERE id_usuario_origen=$1 AND id_usuario_destino=$2 AND estado=$3', [id_sender, id_receiver, "pendiente"]);
    return result;
}

async function obtener_Solicitudes_Pendientes(id) {
    const result = await db.query('SELECT * FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 and estado=$2', [id, "pendiente"]);
    return result;
}

async function aceptar_Solicitud_Amistad(id, id_nuevo_amigo) {
    const result = await db.query('UPDATE SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3', ["aceptada", id_nuevo_amigo, id])
    const result1 = await db.query('INSERT INTO AMIGOS (id_usuario1, id_usuario2) VALUES ($1,$2)', [id, id_nuevo_amigo]);
    
    return result1
}

async function rechazar_Solicitud_Amistad(id, id_nuevo_amigo) {
    const result = await db.query('UPDATE SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3', ["rechazada", id_nuevo_amigo, id])
    return result
}

async function obtener_count_solicitudes_pendientes(id) {
    const result=await db.query('SELECT COUNT(*) AS total FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 and estado=$2', [id, "pendiente"]);
    return result.rows[0].total;
}

async function obtener_count_amigos(id) {
    const result=await db.query('SELECT COUNT(*) AS total FROM AMIGOS WHERE (id_usuario1=$1 OR id_usuario2=$2)', [id, id]);
    return result.rows[0].total;
}

async function obtener_amigos(id) {
    const result=await db.query('SELECT * FROM AMIGOS WHERE (id_usuario1=$1 OR id_usuario2=$2)', [id, id]);
    let lista =[]
    //bucle que recorre la lista para poder devolver solo una array con los ids de los amigos de "id", asi no se devuelve tupla (id1,id2) donde uno de ellos es "id"
    for (const i of result.rows) {
        if (i.id_usuario1 != id) {
            lista.push(i.id_usuario1)
        } else {
            lista.push(i.id_usuario2)
        }
    }

    return lista;
}

async function eliminar_amigo(id, id_amigo_eliminar) {
    //funcion para elimianr una solicitud de amistad de un usuario a otro
    const result = await db.query('DELETE FROM AMIGOS WHERE ((id_usuario1=$1 AND id_usuario2=$2) OR (id_usuario1=$3 AND id_usuario2=$4))', [id, id_amigo_eliminar, id_amigo_eliminar, id]);
    const result1 = await db.query('DELETE FROM SOLICITUD_AMISTAD WHERE ((id_usuario_origen=$1 AND id_usuario_destino=$2) OR (id_usuario_origen=$3 AND id_usuario_destino=$4))', [id, id_amigo_eliminar, id_amigo_eliminar, id]);
    
    return result1;
}

async function buscar_amigos(string_buscar) {
    const result=await db.query('SELECT nombre_usuario FROM USUARIO WHERE nombre_usuario ILIKE $1', [`%${string_buscar}%`]);
    return result.rows
}