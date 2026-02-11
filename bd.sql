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

)

CREATE TABLE ROL(
    id_rol INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
    num_usos_rol INT NOT NULL
)









CREATE TABLE Usuario (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL, 
    monedas INTEGER DEFAULT 0, 

    total_ganadas INTEGER DEFAULT 0,
    total_partidas INTEGER DEFAULT 0,

    numero_amigos INTEGER DEFAULT 0,
    numero_solicitudes INTEGER DEFAULT 0,
    
    avatares_comprados INTEGER[],
    cartas_compradas INTEGER[],

    id_avatar_seleccionado INTEGER,
    id_carta_seleccionada INTEGER,
)




