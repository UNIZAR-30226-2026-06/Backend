// Asegúrate de que las rutas a tus archivos de servicio sean correctas
const userService = require('./userService'); 
const authService = require('../auth/authService');

class UserController {
  
  // ==========================================
  // CREAR CUENTA (Registro)
  // ==========================================
  async register(req, res) {
    try {
      const { nombre_usuario, contrasena, correo } = req.body;

      // 1. Validar que vengan los datos
      if (!nombre_usuario || !contrasena || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      // 2. Comprobar si el usuario o correo ya existen
      const existeUser = await userService.getUserByUsername(nombre_usuario);
      if (existeUser) return res.status(400).json({ error: 'El nombre de usuario ya existe' });

      // 3. Hashear la contraseña antes de guardarla
      const hashedPassword = await authService.hashPassword(contrasena);

      // 4. Guardar en base de datos
      const nuevoId = await userService.createUser(nombre_usuario, hashedPassword, correo);
      
      res.status(201).json({ mensaje: 'Usuario creado con éxito', id: nuevoId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la cuenta' });
    }
  }

  // ==========================================
  // INICIAR SESIÓN (Login)
  // ==========================================
  async login(req, res) {
    try {
      const { nombre_usuario, contrasena } = req.body;

      if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan credenciales' });
      }

      // authService.authenticateUser ya busca la contraseña y la compara
      const esValido = await authService.authenticateUser(nombre_usuario, contrasena);

      if (!esValido) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      // Aquí en el futuro generarías un JWT (Token). Por ahora devolvemos éxito.
      const userData = await userService.getUserByUsername(nombre_usuario);
      res.status(200).json({ mensaje: 'Login exitoso', usuario: userData.nombre_usuario });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  // ==========================================
  // HE OLVIDADO MI CONTRASEÑA
  // ==========================================
  async forgotPassword(req, res) {
    try {
      const { correo } = req.body;

      if (!correo) return res.status(400).json({ error: 'Debes proporcionar un correo' });

      const usuario = await userService.getUserByEmail(correo);
      if (!usuario) {
        // Por seguridad, es mejor devolver "Si el correo existe, se ha enviado un mail", 
        // pero para tu desarrollo podemos ser explícitos.
        return res.status(404).json({ error: 'No existe un usuario con ese correo' });
      }

      // 1. Generamos una contraseña temporal (ej: NotUno2026!)
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      
      // 2. La hasheamos y actualizamos
      const hashedTempPassword = await authService.hashPassword(tempPassword);
      await userService.updateUserPassword(usuario.nombre_usuario, hashedTempPassword);

      // 3. (En un entorno real aquí enviarías un email). 
      // Por ahora, se la devolvemos en la respuesta para que puedas probarlo.
      res.status(200).json({ 
        mensaje: 'Se ha restablecido tu contraseña.',
        nueva_contrasena_temporal: tempPassword 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
  }
}

module.exports = new UserController();