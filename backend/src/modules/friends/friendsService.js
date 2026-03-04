const db = require('../../config/db');

class FriendsService {

  async sendRequest(senderId, receiverId) {
    const result = await db.query(
      'INSERT INTO SOLICITUD_AMISTAD (id_usuario_origen, id_usuario_destino, estado) VALUES ($1, $2, $3)',
      [senderId, receiverId, 'pendiente']
    );
    return result.rowCount === 1;
  }

  async cancelRequest(senderId, receiverId) {
    const result = await db.query(
      'DELETE FROM SOLICITUD_AMISTAD WHERE id_usuario_origen=$1 AND id_usuario_destino=$2 AND estado=$3',
      [senderId, receiverId, 'pendiente']
    );
    return result.rowCount === 1;
  }

  async getPendingRequests(userId) {
    const result = await db.query(
      'SELECT * FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 AND estado=$2',
      [userId, 'pendiente']
    );
    return result.rows;
  }

  async acceptRequest(userId, friendId) {
    await db.query(
      'UPDATE SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3',
      ['aceptada', friendId, userId]
    );
    const result = await db.query(
      'INSERT INTO AMIGOS (id_usuario1, id_usuario2) VALUES ($1, $2)',
      [userId, friendId]
    );
    return result.rowCount === 1;
  }

  async rejectRequest(userId, friendId) {
    const result = await db.query(
      'UPDATE SOLICITUD_AMISTAD SET estado=$1 WHERE id_usuario_origen=$2 AND id_usuario_destino=$3',
      ['rechazada', friendId, userId]
    );
    return result.rowCount === 1;
  }

  async countPendingRequests(userId) {
    const result = await db.query(
      'SELECT COUNT(*) AS total FROM SOLICITUD_AMISTAD WHERE id_usuario_destino=$1 AND estado=$2',
      [userId, 'pendiente']
    );
    return parseInt(result.rows[0].total, 10);
  }

  async countFriends(userId) {
    const result = await db.query(
      'SELECT COUNT(*) AS total FROM AMIGOS WHERE id_usuario1=$1 OR id_usuario2=$1',
      [userId]
    );
    return parseInt(result.rows[0].total, 10);
  }

  async listFriends(userId) {
    const result = await db.query(
      'SELECT * FROM AMIGOS WHERE id_usuario1=$1 OR id_usuario2=$1',
      [userId]
    );
    return result.rows.map(row => (row.id_usuario1 === userId ? row.id_usuario2 : row.id_usuario1));
  }

  async removeFriend(userId, friendId) {
    await db.query(
      'DELETE FROM AMIGOS WHERE (id_usuario1=$1 AND id_usuario2=$2) OR (id_usuario1=$2 AND id_usuario2=$1)',
      [userId, friendId]
    );
    const result = await db.query(
      'DELETE FROM SOLICITUD_AMISTAD WHERE (id_usuario_origen=$1 AND id_usuario_destino=$2) OR (id_usuario_origen=$2 AND id_usuario_destino=$1)',
      [userId, friendId]
    );
    return result.rowCount > 0;
  }

  async searchFriends(searchString) {
    const result = await db.query(
      'SELECT nombre_usuario FROM USUARIO WHERE nombre_usuario ILIKE $1',
      [`%${searchString}%`]
    );
    return result.rows.map(r => r.nombre_usuario);
  }

}

module.exports = new FriendsService();