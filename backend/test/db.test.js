const db = require('../src/config/db');

describe('Database integration tests', () => {
  let client;

  beforeAll(async () => {
    client = await db.connect();
    await client.query('BEGIN');
  });

  afterAll(async () => {
    await client.query('ROLLBACK');
    client.release();
  });

  test('should insert, read and update a user record inside a transaction', async () => {
    const nombre_usuario = `test_user_${Date.now()}`;
    const correo = `${nombre_usuario}@example.com`;
    const contrasena = 'test-password';

    const insertRes = await client.query(
      'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3) RETURNING nombre_usuario, correo',
      [nombre_usuario, contrasena, correo]
    );

    expect(insertRes.rows.length).toBe(1);
    expect(insertRes.rows[0]).toEqual({ nombre_usuario, correo });

    const selectRes = await client.query(
      'SELECT nombre_usuario, correo FROM notuno.USUARIO WHERE nombre_usuario = $1',
      [nombre_usuario]
    );

    expect(selectRes.rows.length).toBe(1);
    expect(selectRes.rows[0].correo).toBe(correo);

    const nuevoCorreo = `${nombre_usuario}+updated@example.com`;
    const updateRes = await client.query(
      'UPDATE notuno.USUARIO SET correo = $1 WHERE nombre_usuario = $2 RETURNING correo',
      [nuevoCorreo, nombre_usuario]
    );

    expect(updateRes.rows.length).toBe(1);
    expect(updateRes.rows[0].correo).toBe(nuevoCorreo);
  });
});
