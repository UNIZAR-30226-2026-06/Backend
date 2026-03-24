const db = require('../../config/db');

class WalletService {

  async getBalance(nombre_usuario) {
    const result = await db.query(
      'SELECT monedas FROM notuno.USUARIO WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    if (result.rows.length === 0) throw new Error('Usuario no encontrado');
    return result.rows[0].monedas;
  }

  async addCoins(nombre_usuario, amount) {
    const result = await db.query(
      'UPDATE notuno.USUARIO SET monedas = monedas + $1 WHERE nombre_usuario = $2 RETURNING monedas',
      [amount, nombre_usuario]
    );
    return result.rows[0].monedas;
  }

  async deductCoins(nombre_usuario, amount) {
    const result = await db.query(
      'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
      [amount, nombre_usuario]
    );

    if (result.rows.length === 0) {
      throw new Error('Fondos insuficientes');
    }

    return result.rows[0].monedas;
  }

  async purchaseAvatar(nombre_usuario, id_avatar) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const avatarRes = await client.query(
        'SELECT precioavatar FROM notuno.AVATAR WHERE id_avatar = $1',
        [id_avatar]
      );

      if (avatarRes.rows.length === 0) {
        throw new Error('Avatar no existe');
      }

      const precio = avatarRes.rows[0].precioavatar;

      const yaComprado = await client.query(
        'SELECT 1 FROM notuno.AVATARES_COMPRADOS WHERE nombre_usuario = $1 AND id_avatar = $2',
        [nombre_usuario, id_avatar]
      );

      if (yaComprado.rows.length > 0) {
        throw new Error('Ya posees este avatar');
      }

      const userRes = await client.query(
        'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
        [precio, nombre_usuario]
      );

      if (userRes.rows.length === 0) {
        throw new Error('Monedas insuficientes');
      }

      await client.query(
        'INSERT INTO notuno.AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)',
        [nombre_usuario, id_avatar]
      );

      await client.query('COMMIT');

      return {
        success: true,
        monedas: userRes.rows[0].monedas,
        avatar_id: id_avatar
      };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async purchaseEstilo(nombre_usuario, id_estilo) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const estiloRes = await client.query(
        'SELECT precioestilo FROM notuno.ESTILO WHERE id_estilo = $1',
        [id_estilo]
      );

      if (estiloRes.rows.length === 0) {
        throw new Error('Estilo no existe');
      }

      const precio = estiloRes.rows[0].precioestilo;

      const yaComprado = await client.query(
        'SELECT 1 FROM notuno.ESTILOS_COMPRADOS WHERE nombre_usuario = $1 AND id_estilo = $2',
        [nombre_usuario, id_estilo]
      );

      if (yaComprado.rows.length > 0) {
        throw new Error('Ya posees este estilo');
      }

      const userRes = await client.query(
        'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
        [precio, nombre_usuario]
      );

      if (userRes.rows.length === 0) {
        throw new Error('Monedas insuficientes');
      }

      await client.query(
        'INSERT INTO notuno.ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)',
        [nombre_usuario, id_estilo]
      );

      await client.query('COMMIT');

      return {
        success: true,
        monedas: userRes.rows[0].monedas,
        estilo_id: id_estilo
      };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new WalletService();