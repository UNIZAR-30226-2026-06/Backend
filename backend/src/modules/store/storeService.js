const user = require('../user/userService.js');   //para comprar articulos tienda
const db = require('../../database');

async function obtener_todos_avatares() {
    const result = await db.query('SELECT * FROM AVATAR ');
    return result;
        
}

async function obtener_todos_estilos() {
    const result = await db.query('SELECT * FROM ESTILO ');
    return result;
        
}

async function obtener_avatar_por_id(id_avatar) {
    const result = await db.query('SELECT * FROM AVATAR WHERE id_avatar=$1 ', [id_avatar]);
    return result;
        
}

async function obtener_estilo_por_id(id_estilo) {
    const result = await db.query('SELECT * FROM ESTILO WHERE id_estilo=$1', [id_estilo]);
    return result;
        
}

async function obtener_estilos_usuario(id) {
    const result = await db.query('SELECT * FROM ESTILOS_COMPRADOS WHERE nombre_usuario=$1 ', [id] );
    let estilos=[]
    for (i of result.rows) {
        const rowEstilo = await db.query('SELECT * FROM ESTILO WHERE id_estilos=$1', [i.id_estilos]);
        estilos.push(rowEstilo.rows[0])
    }
    return estilos;
}

async function estilo_ya_comprado(id_estilo, id_user) {
    const result = await db.query('SELECT COUNT(*) AS total FROM ESTILOS_COMPRADOS WHERE nombre_usuario=$1 AND id_estilos=$2', [id_user, id_estilo] );
    return (result.rows[0].total > 0)
}

async function obtener_avatates_usuario(id) {
    const result = await db.query('SELECT * FROM AVATARES_COMPRADOS WHERE nombre_usuario=$1', [id] );
    let avatares=[]
    for (const i of result.rows) {
        const rowavatar = await db.query('SELECT * FROM AVATAR WHERE id_avatar=$1', [i.id_avatar]);
        avatares.push(rowavatar.rows[0])
    }
    return avatares;
}

async function avatar_ya_comprado(id_avatar, id_user) {
    const result = await db.query('SELECT COUNT(*) AS total FROM AVATARES_COMPRADOS WHERE nombre_usuario=$1 AND id_avatar=$2', [id_user, id_avatar] );
    return (result.rows[0].total > 0)
}

async function comprar_avatar(id_avatar, id_user) {
    try {

    
        const result = await db.query('SELECT precioAvatar FROM AVATAR WHERE id_avatar=$1 ', [id_avatar] );
        if (result.rows.length===0) {
            throw new Error("Avatar no encontrado");
        }
        // se comprueba que el usuario tenga monedas suficientes para realizar la compra
        let precio=result.rows[0].precioAvatar
        let monedas_user_actual=await user.getMonedasById(id_user)
        if (monedas_user_actual > precio) {
            await user.setMonedasById(id_user, monedas_user_actual-precio)
            const result1 = await db.query('INSERT INTO AVATARES_COMPRADOS (nombre_usuario, id_avatar) VALUES ($1,$2) ', [id_user, id_avatar] );
            return result1.rowCount === 1    //si se ha insertado 1 fila, devuelve true
        }else {
            throw new Error("No tienes suficientes monedas para comprar este avatar");
            //return false;
        }
    } catch(error) {
        throw error;
    }
    
}

async function comprar_estilo(id_estilo, id_user) {
    try{
        const result = await db.query('SELECT precioEstilo FROM ESTILO WHERE id_estilo=$1 ', [id_estilo] );
        if (result.rows.length===0) {
            throw new Error("Estilo no encontrado");
        }

        // se comprueba que el usuario tenga monedas suficientes para realizar la compra

        let precio=result.rows[0].precioEstilo
        let monedas_user_actual=await user.getMonedasById(id_user)
        if (monedas_user_actual > precio) {
            await user.setMonedasById(id_user, monedas_user_actual-precio)
            const result1 = await db.query('INSERT INTO ESTILOS_COMPRADOS (nombre_usuario, id_estilos) VALUES ($1,$2) ', [id_user, id_estilo] );
            return result1.rowCount === 1    //si se ha insertado 1 fila, devuelve true
        }else {
            throw new Error("No tienes suficientes monedas para comprar este estilo");
            //return false;
        }
    }catch (error) {
        throw error;    // El error se lanza al controlador (o a quien haya llamado a esta funcion) con el mensaje
    }
    
    
}

async function modificar_visibilidad_Estilo_tienda(id_estilo, bool_visibilidad_estilo) {
    //funcion para determinar si un estilo se muestra al cargar la tienda
    const result = await db.query('UPDATE ESTILO SET muestroEstilo = $1 WHERE id_estilo = $2', [bool_visibilidad_estilo, id_estilo]);
    return result.rowCount === 1    //devuelve true si se ha modificado 1 fila
}

async function modificar_visibilidad_avatar_tienda(id_avatar, bool_visibilidad_avatar) {
    //funcion para determinar si un avatar se muestra al cargar la tienda
    const result = await db.query('UPDATE AVATAR SET muestoAvatar = $1 WHERE id_avatar = $2', [bool_visibilidad_avatar, id_avatar]);
    return result.rowCount === 1    //devuelve true si se ha modificado 1 fila
}

async function obtener_avatares_tienda() {
    const result = await db.query('SELECT * FROM AVATAR WHERE muestoAvatar =$1 ', [true]);
    return result
}

async function obtener_estilos_tienda() {
    const result = await db.query('SELECT * FROM ESTILO WHERE muestroEstilo =$1 ', [true]);
    return result
}