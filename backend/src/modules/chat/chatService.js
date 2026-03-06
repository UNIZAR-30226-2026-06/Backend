// ================= CHAT SERVICE =================
class ChatService {

  processMessage(nombre_usuario, mensaje) {
    if (!mensaje || mensaje.trim() === '') {
      throw new Error('Mensaje vacío');
    }

    // Limitar longitud (máx. 150 caracteres)
    let texto = mensaje.substring(0, 150);

    // Filtro básico de palabras prohibidas
    const palabrasProhibidas = ['insulto1', 'insulto2'];
    palabrasProhibidas.forEach(palabra => {
      const regex = new RegExp(palabra, 'gi');
      texto = texto.replace(regex, '***');
    });

    return {
      remitente: nombre_usuario,
      texto,
      hora: new Date().toISOString()
    };
  }

}

module.exports = new ChatService();