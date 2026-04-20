const db = require('../../config/db');

class FriendsService {

  async enviarSolicitud(senderId, receiverId) {
    const result = await db.query(
      `INSERT INTO notuno.SOLICITUD_AMISTAD (id_usuario_origen, id_usuario_destino, estado)
       VALUES ($1, $2, 'pendiente')
       ON CONFLICT (id_usuario_origen, id_usuario_destino)
       DO UPDATE
         SET estado = 'pendiente'
       WHERE notuno.SOLICITUD_AMISTAD.estado = 'rechazada'
       RETURNING estado`,
      [senderId, receiverId]
    );

    if (result.rowCount === 1) {
      return true;
    }

    const existing = await db.query(
      'SELECT estado FROM notuno.SOLICITUD_AMISTAD WHERE id_usuario_origen=$1 AND id_usuario_destino=$2',
      [senderId, receiverId]
    );

    const estadoActual = existing.rows[0]?.estado;
    const error = new Error(
      estadoActual === 'aceptada'
        ? 'Ya sois amigos'
        : 'Ya existe una solicitud pendiente'
    );
    error.status = 409;
    throw error;
  }

  async cancelarSolicitud(senderId, receiverId) {
    const result = await db.query(
      'DELETE FROM notuno.SOLICITUD_AMISTAD WHERE id_usuario_origen=$1 AND id_usuario_destino=$2 AND estado=$3',
      [senderId, receiverId, 'pendiente']
    );
    return result.rowCount === 1;
  }

  async obtenerSolicitudesPendientes(userId) {
    const result = await db.query(
      'SELECT * FROM notuno.SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 AND estado=$2',
      [userId, 'pendiente']
    );
    return result.rows;
  }
  async obtenerSolicitudesEnviadas(userId) {
    const result = await db.query(
      'SELECT * FROM notuno.SOLICITUD_AMISTAD WHERE id_usuario_origen=$1 AND estado=$2',
      [userId, 'pendiente']
    );
    return result.rows;
  }

  async aceptarSolicitud(userIdAcepta, friendId) {
    //tiene que aceptar la solicitud el usuario que la ha recibido (id_usuario_destino)
    const result1= await db.query(
      'UPDATE notuno.SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3',
      ['aceptada', friendId, userIdAcepta]
    );
    if (result1.rowCount === 1) {
      //comprobar orden para que se cumpla el check de la tabla amigos
      if(userIdAcepta<friendId) {
          const result = await db.query(
          'INSERT INTO notuno.AMIGOS (id_usuario1, id_usuario2) VALUES ($1, $2)',
          [userIdAcepta, friendId]
        );
        return result.rowCount === 1;
      } else {
          const result = await db.query(
          'INSERT INTO notuno.AMIGOS (id_usuario1, id_usuario2) VALUES ($1, $2)',
          [friendId, userIdAcepta]
        );
        return result.rowCount === 1;
      }
      
      
    } else {
      throw new Error ("No se ha encontrado ninguna solicitud de amistad a aceptar enviada por " + friendId);
    }
    
    
  }

  async rechazarSolicitud(userId, friendId) {
    const result = await db.query(
      'UPDATE notuno.SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3',
      ['rechazada', friendId, userId]
    );
    return result.rowCount === 1;
  }

  async countPendingRequests(userId) {
    const result = await db.query(
      'SELECT COUNT(*) AS total FROM notuno.SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 AND estado=$2',
      [userId, 'pendiente']
    );
    return parseInt(result.rows[0].total, 10);
  }

  async countFriends(userId) {
    const result = await db.query(
      'SELECT COUNT(*) AS total FROM notuno.AMIGOS WHERE id_usuario1=$1 OR id_usuario2=$1',
      [userId]
    );
    return parseInt(result.rows[0].total, 10);
  }

  async obtenerAmigos(userId) {
    const result = await db.query(
      `SELECT
         u.nombre_usuario,
         u.monedas,
         u.id_avatar_seleccionado AS avatar
       FROM notuno.AMIGOS a
       JOIN notuno.USUARIO u
         ON u.nombre_usuario = CASE
           WHEN a.id_usuario1 = $1 THEN a.id_usuario2
           ELSE a.id_usuario1
         END
       WHERE a.id_usuario1 = $1 OR a.id_usuario2 = $1`,
      [userId]
    );
    return result.rows;
  }

  async eliminarAmigo(userId, friendId) {
    await db.query(
      'DELETE FROM notuno.AMIGOS WHERE (id_usuario1=$1 AND id_usuario2=$2) OR (id_usuario1=$2 AND id_usuario2=$1)',
      [userId, friendId]
    );
    const result = await db.query(
      'DELETE FROM notuno.SOLICITUD_AMISTAD WHERE (id_usuario_origen=$1 AND id_usuario_destino=$2) OR (id_usuario_origen=$2 AND id_usuario_destino=$1)',
      [userId, friendId]
    );
    return result.rowCount > 0;
  }

  async buscarUsuarios(searchString, usuarioActual) {
    const result = await db.query(
      `SELECT
         nombre_usuario,
         monedas,
         id_avatar_seleccionado AS avatar
       FROM notuno.USUARIO
       WHERE nombre_usuario ILIKE $1
         AND nombre_usuario <> $2
       ORDER BY nombre_usuario ASC`,
      [`%${searchString}%`, usuarioActual]
    );
    return result.rows;
  }

}

module.exports = new FriendsService();