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


