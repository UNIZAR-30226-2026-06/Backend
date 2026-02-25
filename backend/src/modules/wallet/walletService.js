const pool = require('../../config/db');

class WalletService {
  
  // Devuelve la cantidad de monedas actuales que tiene un jugador.
  async getBalance(nombre_usuario) {
    const { rows } = await pool.query(
      'SELECT monedas FROM USUARIO WHERE nombre_usuario = $1',
      [nombre_usuario]
    );
    if (rows.length === 0) throw new Error('Usuario no encontrado');
    return rows[0].monedas;
  }

  // Suma una cantidad de monedas al usuario.
  async addCoins(nombre_usuario, amount) {
    const { rows } = await pool.query(
      'UPDATE USUARIO SET monedas = monedas + $1 WHERE nombre_usuario = $2 RETURNING monedas',
      [amount, nombre_usuario]
    );
    
    return rows[0];
  }

    // Resta monedas al usuario. Debe verificar primero si el usuario tiene saldo suficiente para evitar que el balance quede en negativo.
  async deductCoins(nombre_usuario, amount) {
    const { rows } = await pool.query(
      'UPDATE USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 RETURNING monedas',
      [amount, nombre_usuario]
    );

    // Si no devuelve filas, es porque no existe el usuario o no tiene suficiente saldo
    if (rows.length === 0) {
      throw new Error('No se pudieron restar las monedas: Saldo insuficiente o usuario no encontrado');
    }

    return rows[0];
  }

  // Gestiona la compra completa de un avatar.
  async purchaseAvatar(nombre_usuario, id_avatar) {
    // Pedimos un cliente dedicado del pool para hacer la transacción
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN'); 

      // 0. Verificar si el usuario ya tiene este estilo comprado
      const checkPropiedad = await client.query(
        'SELECT 1 FROM AVATARES_COMPRADOS WHERE nombre_usuario = $1 AND id_avatar = $2',
        [nombre_usuario, id_avatar]
      );
      if (checkPropiedad.rows.length > 0) {
        throw new Error('El usuario ya posee este avatar');
      }

      // 1. Ver precio del avatar
      const avatarRes = await client.query('SELECT precioAvatar FROM AVATAR WHERE id_avatar = $1', [id_avatar]);
      if (avatarRes.rows.length === 0) throw new Error('El avatar no existe');
      const precio = avatarRes.rows[0].precioavatar;

      // 2. Cobrar al usuario (y comprobar que no se quede en negativo)
      const userRes = await client.query(
        'UPDATE USUARIO SET monedas = monedas - $1 WHERE nombre_usuario = $2 AND monedas >= $1 RETURNING monedas',
        [precio, nombre_usuario]
      );
      
      if (userRes.rows.length === 0) {
        throw new Error('Monedas insuficientes o usuario no encontrado');
      }

      // 3. Darle el avatar
      await client.query(
        'INSERT INTO AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1, $2)',
        [nombre_usuario, id_avatar]
      );

      await client.query('COMMIT'); 
      return { success: true, newBalance: userRes.rows[0].monedas };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release(); // Soltamos el cliente
    }
  }

  async purchaseStyle(nombre_usuario, id_estilo) {
    // Pedimos un cliente dedicado para hacer la transacción segura
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 1. Verificar si el usuario ya tiene este estilo comprado
      const checkPropiedad = await client.query(
        'SELECT 1 FROM ESTILOS_COMPRADOS WHERE nombre_usuario = $1 AND id_estilo = $2',
        [nombre_usuario, id_estilo]
      );
      if (checkPropiedad.rows.length > 0) {
        throw new Error('El usuario ya posee este estilo');
      }

      // 2. Obtener el precio del estilo
      const estiloRes = await client.query(
        'SELECT precioEstilo FROM ESTILO WHERE id_estilo = $1', 
        [id_estilo]
      );
      if (estiloRes.rows.length === 0) {
        throw new Error('El estilo solicitado no existe');
      }
      
      // En PostgreSQL, los nombres de columnas a veces vuelven en minúscula
      const precio = estiloRes.rows[0].precioestilo; 

      // 3. Cobrar al usuario (y comprobar que no se quede en negativo)
      const userRes = await client.query(
        `UPDATE USUARIO 
         SET monedas = monedas - $1 
         WHERE nombre_usuario = $2 AND monedas >= $1 
         RETURNING monedas`,
        [precio, nombre_usuario]
      );
      
      if (userRes.rows.length === 0) {
        throw new Error('Monedas insuficientes para comprar este estilo');
      }

      // 4. Registrar la compra dándole el estilo al usuario
      await client.query(
        'INSERT INTO ESTILOS_COMPRADOS (nombre_usuario, id_estilo) VALUES ($1, $2)',
        [nombre_usuario, id_estilo]
      );

      await client.query('COMMIT'); // Guardamos todo
      
      return { 
        success: true, 
        message: 'Estilo comprado con éxito',
        newBalance: userRes.rows[0].monedas 
      };

    } catch (error) {
      await client.query('ROLLBACK'); // Si algo falla, se deshace
      throw error; // Lanzamos el error para que el Controlador (Controller) lo maneje
    } finally {
      client.release(); // Soltamos el cliente para que no se sature la base de datos
    }
  }

}

module.exports = new WalletService();