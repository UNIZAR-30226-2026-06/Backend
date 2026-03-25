CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS notuno;
SET search_path TO notuno;

-- =========================
-- AVATAR
-- =========================
CREATE TABLE AVATAR(
    id_avatar SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    muestro_avatar BOOLEAN NOT NULL DEFAULT true,
    precio_avatar INTEGER NOT NULL CHECK (precio_avatar >= 0),
    nombre VARCHAR(100)
);

-- =========================
-- ESTILO
-- =========================
CREATE TABLE ESTILO(
    id_estilo SERIAL PRIMARY KEY,
    muestro_estilo BOOLEAN NOT NULL DEFAULT true,
    precio_estilo INTEGER NOT NULL CHECK (precio_estilo >= 0),
    nombre VARCHAR(100)
);

-- =========================
-- USUARIO
-- =========================
CREATE TABLE USUARIO (
    nombre_usuario TEXT PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    monedas INTEGER NOT NULL DEFAULT 0 CHECK (monedas >= 0),
    total_ganadas INTEGER NOT NULL DEFAULT 0 CHECK (total_ganadas >= 0),
    total_partidas INTEGER NOT NULL DEFAULT 0 CHECK (total_partidas >= 0),
    id_avatar_seleccionado INTEGER,
    id_estilo_seleccionado INTEGER,
    FOREIGN KEY (id_avatar_seleccionado) REFERENCES AVATAR(id_avatar),
    FOREIGN KEY (id_estilo_seleccionado) REFERENCES ESTILO(id_estilo)
);

-- =========================
-- AMIGOS (evita duplicados espejo)
-- =========================
CREATE TABLE AMIGOS (
    id_usuario1 TEXT NOT NULL,
    id_usuario2 TEXT NOT NULL,
    PRIMARY KEY (id_usuario1, id_usuario2),
    FOREIGN KEY (id_usuario1) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario2) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    CHECK (id_usuario1 < id_usuario2)
);

-- =========================
-- SOLICITUD AMISTAD
-- =========================
CREATE TYPE estado_solicitud AS ENUM ('pendiente','aceptada','rechazada');

CREATE TABLE SOLICITUD_AMISTAD (
    id_usuario_origen TEXT NOT NULL,
    id_usuario_destino TEXT NOT NULL,
    estado estado_solicitud NOT NULL,
    PRIMARY KEY (id_usuario_origen, id_usuario_destino),
    FOREIGN KEY (id_usuario_origen) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_destino) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE
);

-- =========================
-- ROL
-- =========================
CREATE TABLE ROL(
    id_rol SERIAL PRIMARY KEY,
    imagen TEXT NOT NULL,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    num_usos_max INT NOT NULL CHECK (num_usos_max >= 0)
);

-- =========================
-- PARTIDA
-- =========================
CREATE TYPE estado_partida_new AS ENUM (
  'esperando_jugadores',
  'en_curso',
  'pausada',
  'finalizada'
);

CREATE TABLE PARTIDA(
    id_partida UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    num_cartas_inicio INT NOT NULL CHECK (num_cartas_inicio > 0),
    modo_cartas_especiales BOOLEAN NOT NULL,
    modo_roles BOOLEAN NOT NULL,
    sonido BOOLEAN NOT NULL,
    musica BOOLEAN NOT NULL,
    vibracion BOOLEAN NOT NULL,
    estado estado_partida NOT NULL,
    timeout_turno INT NOT NULL CHECK (timeout_turno > 0),
    game_state JSONB,
    version INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    max_jugadores INTEGER NOT NULL DEFAULT 4 CHECK (max_jugadores BETWEEN 2 AND 4),
    partida_publica BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_partida_estado ON PARTIDA(estado);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_partida
BEFORE UPDATE ON PARTIDA
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- =========================
-- USUARIO_EN_PARTIDA
-- =========================
CREATE TABLE USUARIO_EN_PARTIDA(
    id_partida_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario TEXT NOT NULL,
    id_partida UUID NOT NULL,
    usos_rol_partida INT NOT NULL DEFAULT 0 CHECK (usos_rol_partida >= 0),
    id_rol INT,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol),
    UNIQUE (id_partida, id_usuario)
);

CREATE INDEX idx_usuario_partida_partida
ON USUARIO_EN_PARTIDA(id_partida);

-- =========================
-- CARTA
-- =========================
CREATE TYPE tipo_carta AS ENUM ('numero', 'especial', 'rol');

CREATE TABLE CARTA (
    id_carta SERIAL PRIMARY KEY,
    tipo tipo_carta NOT NULL,
    color VARCHAR(20),
    numero INT,
    codigo TEXT NOT NULL,
    id_estilo INT NOT NULL,
    FOREIGN KEY (id_estilo) REFERENCES ESTILO(id_estilo) ON DELETE CASCADE,
    CHECK (
        (tipo = 'numero' AND color IS NOT NULL AND numero IS NOT NULL)
        OR
        ((tipo = 'especial' OR tipo='rol') AND codigo IS NOT NULL)
    )
);

-- =========================
-- AVATARES COMPRADOS
-- =========================
CREATE TABLE AVATARES_COMPRADOS(
    nombre_usuario TEXT NOT NULL,
    id_avatar INT NOT NULL,
    PRIMARY KEY (nombre_usuario, id_avatar),
    FOREIGN KEY (nombre_usuario) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_avatar) REFERENCES AVATAR(id_avatar) ON DELETE CASCADE
);

-- =========================
-- ESTILOS COMPRADOS
-- =========================
CREATE TABLE ESTILOS_COMPRADOS(
    nombre_usuario TEXT NOT NULL,
    id_estilo INT NOT NULL,
    PRIMARY KEY (nombre_usuario, id_estilo),
    FOREIGN KEY (nombre_usuario) REFERENCES USUARIO(nombre_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_estilo) REFERENCES ESTILO(id_estilo) ON DELETE CASCADE
);