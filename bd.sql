CREATE TABLE PARTIDA(
    id_partida INT PRIMARY KEY,
    num_cartas_inicio INT NOT NULL,
    modo_cartas_especiales BOOLEAN NOT NULL,
    modo_roles BOOLEAN NOT NULL,
    sonido BOOLEAN NOT NULL,
    musica BOOLEAN NOT NULL,
    vibracion BOOLEAN NOT NULL,
    carta_actual_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('en curso','pausada', 'finalizada')),
    orden_turnos []INT NOT NULL,
    sentido INT NOT NULL CHECK (sentido IN (1, -1)),
    timeout_turno INT NOT NULL,
    FOREIGN KEY (carta_actual_id) REFERENCES CARTA(id_carta)

);

CREATE TABLE ROL(
    id_rol INT PRIMARY KEY,
    imagen TEXT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    num_usos_max INT NOT NULL
);

CREATE TABLE USUARIO_EN_PARTIDA(
    id_partidaUsuario SERIAL PRIMARY KEY,
    id_usuario VARCHAR(50),
    id_partida INT,
    usos_rol_partida INT NOT NULL,
    total_cartas INT NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(nombre_usuario),
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
    FOREIGN KEY (id_usuario1) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_usuario2) REFERENCES USUARIO(nombre_usuario)
);

CREATE TABLE SOLICITUD_AMISTAD (
    id_usuario_origen VARCHAR(50),
    id_usuario_destino VARCHAR(50),
    estado VARCHAR(100) NOT NULL CHECK (estado IN ('pendiente', 'aceptada', 'rechazada')),
    FOREIGN KEY (id_usuario_origen) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_usuario_destino) REFERENCES USUARIO(nombre_usuario),
    PRIMARY KEY (id_usuario_origen, id_usuario_destino)
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
    FOREIGN KEY (id_estilo_seleccionadO) REFERENCES ESTILO_AVATAR(id_estilo)
);

CREATE TABLE CARTA(
    id_carta SERIAL PRIMARY KEY,
    id_estilo INT NOT NULL,
    FOREIGN KEY (id_estilo) REFERENCES ESTILO(id_estilo) ON DELETE CASCADE
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

CREATE TABLE ESTILO(
    id_estilo SERIAL PRIMARY KEY,
    fondo TEXT NOT NULL,
    reverso TEXT NOT NULL,
    muestroEstilo BOOLEAN NOT NULL
);

CREATE TABLE MAZO (
    id_mazo SERIAL PRIMARY KEY,
    id_partida INT NOT NULL,
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida) ON DELETE CASCADE
);

CREATE TABLE MAZO_EN_JUEGO(
    id_mazo INT NOT NULL,
    id_carta INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_mazo, id_carta),
    FOREIGN KEY (id_mazo) REFERENCES MAZO(id_mazo),
    FOREIGN KEY (id_carta) REFERENCES CARTA(id_carta) 

);

CREATE TABLE CARTAS_USUARIO(
    id_partidaUsuario VARCHAR(50) NOT NULL,
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
    id_estilos  INT NOT NULL,
    PRIMARY KEY (nombre_usuario, id_avatar),
    FOREIGN KEY (nombre_usuario) REFERENCES USUARIO(nombre_usuario),
    FOREIGN KEY (id_estilos) REFERENCES ESTILO(id_estilo)
);
