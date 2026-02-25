CREATE SCHEMA IF NOT EXISTS notuno;
SET search_path TO notuno;

CREATE TABLE AVATAR(
    id_avatar SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    muestoAvatar BOOLEAN NOT NULL,
    precioAvatar INTEGER NOT NULL
);

CREATE TABLE ESTILO(
    id_estilo SERIAL PRIMARY KEY,
    fondo TEXT NOT NULL,
    reverso TEXT NOT NULL,
    muestroEstilo BOOLEAN NOT NULL,
    precioEstilo INTEGER NOT NULL
);

CREATE TABLE USUARIO (
    nombre_usuario TEXT PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL, 
    correo VARCHAR(255) NOT NULL UNIQUE,
    monedas INTEGER DEFAULT 0, 
    total_ganadas INTEGER DEFAULT 0,
    total_partidas INTEGER DEFAULT 0,
    numero_amigos INTEGER DEFAULT 0,
    numero_solicitudes INTEGER DEFAULT 0,
    id_avatar_seleccionado INTEGER,
    id_estilo_seleccionadO INTEGER,
    FOREIGN KEY (id_avatar_seleccionado) REFERENCES AVATAR(id_avatar),
    FOREIGN KEY (id_estilo_seleccionadO) REFERENCES ESTILO(id_estilo)
);

CREATE TABLE AMIGOS (
    id_usuario1 VARCHAR(50),
    id_usuario2 VARCHAR(50),
    PRIMARY KEY (id_usuario1, id_usuario2),
    FOREIGN KEY (id_usuario1) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_usuario2) REFERENCES USUARIO(nombre_usuario)
);

CREATE TABLE SOLICITUD_AMISTAD (
    id_usuario_origen VARCHAR(50),
    id_usuario_destino VARCHAR(50),
    estado VARCHAR(100) NOT NULL CHECK (estado IN ('pendiente', 'aceptada','rechazada')),
    PRIMARY KEY (id_usuario_origen, id_usuario_destino),
    FOREIGN KEY (id_usuario_origen) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_usuario_destino) REFERENCES USUARIO(nombre_usuario)
);

CREATE TABLE ROL(
    id_rol SERIAL PRIMARY KEY,
    imagen TEXT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    num_usos_max INT NOT NULL
);

CREATE TABLE PARTIDA(
    id_partida SERIAL PRIMARY KEY,
    num_cartas_inicio INT NOT NULL,
    modo_cartas_especiales BOOLEAN NOT NULL,
    modo_roles BOOLEAN NOT NULL,
    sonido BOOLEAN NOT NULL,
    musica BOOLEAN NOT NULL,
    vibracion BOOLEAN NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('en curso','pausada','finalizada', 'esperando jugadores')),
    timeout_turno INT NOT NULL,
    game_state JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE USUARIO_EN_PARTIDA(
    id_partidaUsuario SERIAL PRIMARY KEY,
    id_usuario VARCHAR(50) NOT NULL,
    id_partida INT NOT NULL,
    usos_rol_partida INT NOT NULL DEFAULT 0,
    id_rol INT,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

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

CREATE TABLE CARTAS_USUARIO(
    id_partidaUsuario INT NOT NULL,
    id_carta INT NOT NULL,
    PRIMARY KEY (id_partidaUsuario, id_carta),
    FOREIGN KEY (id_partidaUsuario) REFERENCES USUARIO_EN_PARTIDA(id_partidaUsuario),
    FOREIGN KEY (id_carta) REFERENCES CARTA(id_carta)
);

CREATE TABLE AVATARES_COMPRADOS(
    nombre_usuario VARCHAR(50) NOT NULL,
    id_avatar  INT NOT NULL,
    PRIMARY KEY (nombre_usuario, id_avatar),
    FOREIGN KEY (nombre_usuario) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_avatar) REFERENCES AVATAR(id_avatar)
);

CREATE TABLE ESTILOS_COMPRADOS(
    nombre_usuario VARCHAR(50) NOT NULL,
    id_estilo  INT NOT NULL,
    PRIMARY KEY (nombre_usuario, id_estilo),
    FOREIGN KEY (nombre_usuario) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_estilo) REFERENCES ESTILO(id_estilo)
);