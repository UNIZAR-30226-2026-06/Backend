const db = require('../src/config/db');

describe('Database integration tests', () => {
  let client;

  beforeAll(async () => {
    client = await db.connect();
  });

  beforeEach(async () => {
    await client.query('BEGIN');
  });

  afterEach(async () => {
    await client.query('ROLLBACK');
  });

  afterAll(async () => {
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

  test('should reject inserting a user with a null primary key', async () => {
    await expect(
      client.query(
        'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3)',
        [null, 'password', 'null-user@example.com']
      )
    ).rejects.toMatchObject({ code: '23502' });
  });

  test('should reject inserting a duplicate user primary key', async () => {
    const nombre_usuario = `test_user_dup_${Date.now()}`;
    const correo = `${nombre_usuario}@example.com`;

    await client.query(
      'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3)',
      [nombre_usuario, 'password', correo]
    );

    await expect(
      client.query(
        'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3)',
        [nombre_usuario, 'password2', `${nombre_usuario}+2@example.com`]
      )
    ).rejects.toMatchObject({ code: '23505' });
  });

  test('should reject inserting a CARTA without required fields for tipo especial', async () => {
    const styleRes = await client.query(
      'INSERT INTO notuno.ESTILO (image, precio_estilo, nombre) VALUES ($1, $2, $3) RETURNING id_estilo',
      ['tmp.png', 0, 'tmp-estilo']
    );
    const idEstilo = styleRes.rows[0].id_estilo;

    await expect(
      client.query(
        'INSERT INTO notuno.CARTA (tipo, color, numero, codigo, id_estilo) VALUES ($1, $2, $3, $4, $5)',
        ['especial', null, null, null, idEstilo]
      )
    ).rejects.toMatchObject({ code: '23514' });
  });
});
