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
    FOREIGN KEY (carta_actual_id) REFERENCES CARTA(id_carta)

);

CREATE TABLE ROL(
    id_rol INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
    num_usos_rol INT NOT NULL
);









CREATE TABLE Usuario (
    id_usuario VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL, 
    correo VARCHAR(255) NOT NULL UNIQUE,
    monedas INTEGER DEFAULT 0, 

    total_ganadas INTEGER DEFAULT 0,
    total_partidas INTEGER DEFAULT 0,

    numero_amigos INTEGER DEFAULT 0,
    numero_solicitudes INTEGER DEFAULT 0,
    
    avatares_comprados INTEGER[],
    cartas_compradas INTEGER[],

    id_avatar_seleccionado INTEGER,
    id_carta_seleccionada INTEGER,
);


CREATE TABLE Carta(
    id_carta SERIAL PRIMARY KEY,
);

CREATE TABLE Carta_de_numero(
    id_carta INTEGER PRIMARY KEY,
    color VARCHAR(20) NOT NULL,
    numero INTEGER NOT NULL,
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE Carta_especial_color(
    id_carta INTEGER PRIMARY KEY,
    color VARCHAR(20) NOT NULL, 
    tipo VARCHAR(30) NOT NULL
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE Carta_especial (
    id_carta INTEGER PRIMARY KEY, 
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);


