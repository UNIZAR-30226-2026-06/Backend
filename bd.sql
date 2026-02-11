CREATE TABLE PARTIDA(
    id_partida INT PRIMARY KEY,
    num_cartas_inicio INT NOT NULL,
    modo_cartas_especiales BOOLEAN NOT NULL,
    modo_roles BOOLEAN NOT NULL,
    sonido BOOLEAN NOT NULL,
    musica BOOLEAN NOT NULL,
    vibracion BOOLEAN NOT NULL,
    carta_actual_id INT NOT NULL,
    pausa BOOLEAN NOT NULL,
    acabada BOOLEAN NOT NULL,
    FOREIGN KEY (carta_actual_id) REFERENCES CARTA(id_carta)

);

CREATE TABLE ROL(
    id_rol INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
    num_usos_max INT NOT NULL
);

CREATE TABLE USUARIO_EN_PARTIDA(
    id_partidaUsuario SERIAL PRIMARY KEY,
    id_usuario VARCHAR(50),
    id_partida INT,
    usos_rol_partida INT NOT NULL,
    total_cartas INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(username),
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida),
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

CREATE TABLE CARTA_USUARIOPARTIDA (
    id_partidaUsuario INT,
    id_carta INT,
    PRIMARY KEY (id_partidaUsuario, id_carta),
    FOREIGN KEY (id_partidaUsuario) REFERENCES USUARIO_EN_PARTIDA(id_partidaUsuario),
    FOREIGN KEY (id_carta) REFERENCES CARTA(id_carta)
);

CREATE TABLE AMIGOS (
    id_usuario1 VARCHAR(50),
    id_usuario2 VARCHAR(50),
    PRIMARY KEY (id_usuario1, id_usuario2),
    FOREIGN KEY (id_usuario1) REFERENCES Usuario(username),
    FOREIGN KEY (id_usuario2) REFERENCES Usuario(username)
);

CREATE TABLE SOLICITUD_AMISTAD (
    id_solicitud INT PRIMARY KEY,
    id_usuario_origen VARCHAR(50),
    id_usuario_destino VARCHAR(50),
    estado VARCHAR(100) NOT NULL CHECK (estado IN ('pendiente', 'aceptada', 'rechazada')),
    FOREIGN KEY (id_usuario_origen) REFERENCES Usuario(username),
    FOREIGN KEY (id_usuario_destino) REFERENCES Usuario(username)
);







CREATE TABLE USUARIO (
    id_usuario VARCHAR(50) PRIMARY KEY,
    contrasena VARCHAR(255) NOT NULL, 
    correo VARCHAR(255) NOT NULL UNIQUE,
    monedas INTEGER DEFAULT 0, 

    total_ganadas INTEGER DEFAULT 0,
    total_partidas INTEGER DEFAULT 0,

    numero_amigos INTEGER DEFAULT 0,
    numero_solicitudes INTEGER DEFAULT 0,
    
    avatares_comprados INTEGER[],
    estilos_compradas INTEGER[],

    id_avatar_seleccionado INTEGER,
    id_estilo_seleccionada INTEGER,

    FOREIGN KEY (avatares_comprados) REFERENCES AVATAR(id_avatar),
);


CREATE TABLE CARTA(
    id_carta SERIAL PRIMARY KEY,
);

CREATE TABLE CARTA_DE_NUMERO(
    id_carta INTEGER PRIMARY KEY,
    color VARCHAR(20) NOT NULL,
    numero INTEGER NOT NULL,
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE CARTA_ESPECIAL_COLOR(
    id_carta INTEGER PRIMARY KEY,
    color VARCHAR(20) NOT NULL, 
    tipo VARCHAR(30) NOT NULL
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE CARTA_ESPECIAL (
    id_carta INTEGER PRIMARY KEY, 
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE AVATAR(
    id_avatar SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    muestoAvatar BOOLEAN NOT NULL
);

CREATE TABLE ESTILO_AVATAR(
    id_estilo SERIAL PRIMARY KEY,
    muestroEstilo BOOLEAN NOT NULL
);

CREATE TABLE USUARIO_PARTIDA_ROL(

    pk_usuario_partida_rol SERIAL PRIMARY KEY,
    id_usuario VARCHAR(50) NOT NULL,
    id_partida INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida)
    CONSTRAINT pk_usuario_partida_rol PRIMARY KEY (id_usuario, id_partida)
)
