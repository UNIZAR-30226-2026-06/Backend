const db = require('../../database');

async function enviar_Solicitud_Amistad(id_sender, id_receiver) {
    //funcion para enviar una solicitud de amistad de un usuario a otro
    const [result] = await db.query('INSERT INTO SOLICITUD_AMISTAD (id_usuario_origen, id_usuario_destino, estado) VALUES (?,?,?)', [id_sender, id_receiver, "pendiente"]);
    return result.insertId;
}

async function eliminar_solicitud_amistad(id_sender, id_receiver) {
    //funcion para eliminar una solicitud de amistad de un usuario a otro
    const [result] = await db.query('DELETE FROM SOLICITUD_AMISTAD WHERE id_usuario_origen=? AND id_usuario_destino=?', [id_sender, id_receiver, "pendiente"]);
    return result;
}

async function obtener_Solicitudes_Pendientes(id) {
    const [rows] = await db.query('SELECT * FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=? and estado="pendiente"', [id]);
    return rows;
}

async function aceptar_Solicitud_Amistad(id, id_nuevo_amigo) {
    const [result] = await db.query('UPDATE SOLICITUD_AMISTAD SET estado="aceptada" WHERE id_usuario_origen=? AND id_usuario_destino=?', [id_nuevo_amigo, id])
    const [result1] = await db.query('INSERT INTO AMIGOS (id_usuario1, id_usuario2) VALUES (?,?)', [id, id_nuevo_amigo]);
    
    return result1
}

async function rechazar_Solicitud_Amistad(id, id_nuevo_amigo) {
    const [result] = await db.query('UPDATE SOLICITUD_AMISTAD SET estado="rechazada" WHERE id_usuario_origen=? AND id_usuario_destino=?', [id_nuevo_amigo, id])
    return result
}

async function obtener_count_solicitudes_pendientes(id) {
    const [result]=await db.query('SELECT COUNT(*) AS total FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=? and estado="pendiente"', [id]);
    return result[0].total;
}

async function obtener_count_amigos(id) {
    const [result]=await db.query('SELECT COUNT(*) AS total FROM AMIGOS WHERE (id_usuario1=? OR id_usuario2=?)', [id, id]);
    return result[0].total;
}

async function obtener_amigos(id) {
    const [result]=await db.query('SELECT * FROM AMIGOS WHERE (id_usuario1=? OR id_usuario2=?)', [id, id]);
    lista =[]
    //bucle que recorre la lista para poder devolver solo una array con los ids de los amigos de "id", asi no se devuelve tupla (id1,id2) donde uno de ellos es "id"
    for (i of result) {
        if (i.id_usuario1 != id) {
            lista.append(id_usuario1)
        } else {
            lista.append(id_usuario2)
        }
    }

    return lista;
}

async function eliminar_amigo(id, id_amigo_eliminar) {
    //funcion para elimianr una solicitud de amistad de un usuario a otro
    const [result] = await db.query('DELETE FROM AMIGOS WHERE ((id_usuario1=? AND id_usuario2=?) OR (id_usuario1=? AND id_usuario2=?))', [id, id_amigo_eliminar, id_amigo_eliminar, id]);
    return result;
}

async function buscar_amigos(string_buscar) {
    const [result]=await db.query('SELECT nombre_usuario FROM USUARIO WHERE (nombre_usuario LIKE ?)', [`%${string_buscar}%`]);
    
}