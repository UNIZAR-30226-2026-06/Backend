const db = require('../../config/db');

class WalletService {

  // Obtener saldo actual de un usuario
  async getBalance(nombre_usuario) {
    const result = await db.query('SELECT monedas FROM notuno.USUARIO WHERE nombre_usuario = $1', [nombre_usuario]);
    if (result.rows.length === 0) throw new Error('Usuario no encontrado');
    return result.rows[0].monedas;
  }

  // Sumar monedas al usuario
  async addCoins(nombre_usuario, amount) {
    const result = await db.query(
      'UPDATE notuno.USUARIO SET monedas = monedas + $1 WHERE nombre_usuario = $2 RETURNING monedas',
      [amount, nombre_usuario]
    );
    if (result.rows.length === 0) throw new Error('Usuario no encontrado');
    return result.rows[0].monedas;
  }

  // Restar monedas, verificando que no quede en negativo
  async deductCoins(nombre_usuario, amount) {
    const result = await db.query(
      'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
      [amount, nombre_usuario]
    );
    if (result.rows.length === 0) throw new Error('Monedas insuficientes o usuario no encontrado');
    return result.rows[0].monedas;
  }

  // Comprar un avatar con transacción segura
  async purchaseAvatar(nombre_usuario, id_avatar) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const avatarRes = await client.query('SELECT precioAvatar FROM notuno.AVATAR WHERE id_avatar = $1', [id_avatar]);
      if (avatarRes.rows.length === 0) throw new Error('Avatar no existe');
      const precio = avatarRes.rows[0].precioAvatar;

      const check = await client.query('SELECT 1 FROM notuno.AVATARES_COMPRADOS WHERE nombre_usuario = $1 AND id_avatar = $2', [nombre_usuario, id_avatar]);
      if (check.rows.length > 0) throw new Error('El usuario ya posee este avatar');

      const userRes = await client.query(
        'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
        [precio, nombre_usuario]
      );
      if (userRes.rows.length === 0) throw new Error('Monedas insuficientes o usuario no encontrado');

      await client.query('INSERT INTO notuno.AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)', [nombre_usuario, id_avatar]);

      await client.query('COMMIT');
      return { success: true, newBalance: userRes.rows[0].monedas };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Comprar un estilo con transacción segura
  async purchaseStyle(nombre_usuario, id_estilo) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const estiloRes = await client.query('SELECT precioEstilo FROM notuno.ESTILO WHERE id_estilo = $1', [id_estilo]);
      if (estiloRes.rows.length === 0) throw new Error('El estilo no existe');
      const precio = estiloRes.rows[0].precioEstilo;

      const check = await client.query('SELECT 1 FROM notuno.ESTILOS_COMPRADOS WHERE nombre_usuario = $1 AND id_estilo = $2', [nombre_usuario, id_estilo]);
      if (check.rows.length > 0) throw new Error('El usuario ya posee este estilo');

      const userRes = await client.query(
        'UPDATE notuno.USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
        [precio, nombre_usuario]
      );
      if (userRes.rows.length === 0) throw new Error('Monedas insuficientes para comprar este estilo');

      await client.query('INSERT INTO notuno.ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)', [nombre_usuario, id_estilo]);

      await client.query('COMMIT');
      return { success: true, newBalance: userRes.rows[0].monedas };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new WalletService();