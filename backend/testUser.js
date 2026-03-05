const fetch = require('node-fetch');
const db = require('./src/config/db'); // Conexión PostgreSQL
const API = 'http://localhost:3000';

// JWT generado por testAuth
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfdXN1YXJpbyI6InRlc3Rlcjc4ODE5IiwiaWF0IjoxNzcyNzExMzgzLCJleHAiOjE3NzI3MTQ5ODN9.rU7eiEzhngtsqXD7kFEECjIvnrW23QtAqH5IUEBzupU';

async function getOrCreateFirstAvatarId() {
    let result = await db.query('SELECT id_avatar FROM notuno.AVATAR ORDER BY id_avatar LIMIT 1');
    if (result.rows.length === 0) {
        const res = await db.query(
            "INSERT INTO notuno.AVATAR (nombre, precioAvatar) VALUES ('AvatarTest', 0) RETURNING id_avatar"
        );
        return res.rows[0].id_avatar;
    }
    return result.rows[0].id_avatar;
}

async function getOrCreateFirstStyleId() {
    let result = await db.query('SELECT id_estilo FROM notuno.ESTILO ORDER BY id_estilo LIMIT 1');
    if (result.rows.length === 0) {
        const res = await db.query(
            "INSERT INTO notuno.ESTILO (nombre, precioEstilo) VALUES ('EstiloTest', 0) RETURNING id_estilo"
        );
        return res.rows[0].id_estilo;
    }
    return result.rows[0].id_estilo;
}

async function run() {
    console.log('=== TEST USER MODULE VIA API ===');

    // PERFIL
    const profileRes = await fetch(`${API}/api/v1/usuarios/me`, {
        headers: { 'Authorization': `Bearer ${JWT}` }
    });
    const profile = await profileRes.json();
    console.log('Profile response:', profile);

    // CAMBIAR AVATAR
    let avatar_id = await getOrCreateFirstAvatarId();
    const avatarRes = await fetch(`${API}/api/v1/usuarios/me/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
        body: JSON.stringify({ avatar_id })
    });
    console.log('Change avatar response:', await avatarRes.json());

    // CAMBIAR ESTILO
    let estilo_id = await getOrCreateFirstStyleId();
    const styleRes = await fetch(`${API}/api/v1/usuarios/me/estilo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${JWT}` },
        body: JSON.stringify({ estilo_id })
    });
    console.log('Change style response:', await styleRes.json());
}

run().catch(err => console.error(err));