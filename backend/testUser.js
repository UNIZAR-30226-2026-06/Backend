require('dotenv').config();
const fetch = require('node-fetch');
const db = require('./src/config/db');

const API = 'http://localhost:3000';

// JWT del usuario
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfdXN1YXJpbyI6InRlc3RlcjE3NzI3OTE5OTcyNTkiLCJpYXQiOjE3NzI3OTE5OTcsImV4cCI6MTc3Mjc5NTU5N30.w4VvZBp37lV8wgZDs9CR5mReoAvttrbmkuegNzPbK9M';

// ---------- AVATAR ----------
async function getOrCreateAvatar() {

    const existing = await db.query(
        'SELECT id_avatar FROM notuno.avatar LIMIT 1'
    );

    if (existing.rows.length > 0) {
        return existing.rows[0].id_avatar;
    }

    const created = await db.query(`
        INSERT INTO notuno.avatar (image, muestoavatar, precioavatar)
        VALUES ('default_avatar.png', true, 0)
        RETURNING id_avatar
    `);

    return created.rows[0].id_avatar;
}

// ---------- ESTILO ----------
async function getOrCreateStyle() {

    const existing = await db.query(
        'SELECT id_estilo FROM notuno.estilo LIMIT 1'
    );

    if (existing.rows.length > 0) {
        return existing.rows[0].id_estilo;
    }

    const created = await db.query(`
        INSERT INTO notuno.estilo (fondo, reverso, muestroestilo, precioestilo)
        VALUES ('default_bg.png','default_back.png', true, 0)
        RETURNING id_estilo
    `);

    return created.rows[0].id_estilo;
}

// ---------- TEST ----------
async function run() {

    console.log("=== TEST USER MODULE VIA API ===");

    // PERFIL
    const profileRes = await fetch(`${API}/api/v1/usuarios/me`, {
        headers: { Authorization: `Bearer ${JWT}` }
    });

    const profile = await profileRes.json();
    console.log("Profile response:", profile);


    // AVATAR
    const avatar_id = await getOrCreateAvatar();

    const avatarRes = await fetch(`${API}/api/v1/usuarios/me/avatar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JWT}`
        },
        body: JSON.stringify({ avatar_id })
    });

    const avatarResult = await avatarRes.json();
    console.log("Change avatar response:", avatarResult);


    // ESTILO
    const estilo_id = await getOrCreateStyle();

    const styleRes = await fetch(`${API}/api/v1/usuarios/me/estilo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JWT}`
        },
        body: JSON.stringify({ estilo_id })
    });

    const styleResult = await styleRes.json();
    console.log("Change style response:", styleResult);

}

run().catch(console.error);