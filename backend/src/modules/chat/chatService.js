// Se gestiona las palabras que no se pueden enviar entre los jugadores y si los mensajes estan vacios
const db = require('../../config/db');

class chatService{
processMatchMessage(nombre_usuario, mensaje) {
    if (!mensaje || mensaje.trim() === '') {
      throw new Error('Mensaje vacío');
    }

    // Limitar longitud (max 150 caracteres)
    let texto = mensaje.substring(0, 150);

    // Filtro básico de palabras
    const palabrasProhibidas = ['insulto1', 'insulto2'];
    palabrasProhibidas.forEach(palabra => {
      const regex = new RegExp(palabra, 'gi');
      texto = texto.replace(regex, '***');
    });

    // Devolver el objeto formateado que leerá el Frontend
    return {
      remitente: nombre_usuario,
      texto: texto,
      hora: new Date().toISOString()
    };
  }
}

module.exports = new ChatService();