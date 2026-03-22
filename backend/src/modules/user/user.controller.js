// ================= USER CONTROLLER =================
const userService = require('./userService'); 
const authService = require('../auth/authService');

class UserController {

  // =========================
  // OLVIDÉ MI CONTRASEÑA
  // =========================
  async forgotPassword(req, res, next) {
    try {
      const { correo } = req.body;
      if (!correo) return res.status(400).json({ message: 'Debes proporcionar un correo' });

      const usuario = await userService.getUserByEmail(correo);
      if (!usuario) return res.status(404).json({ message: 'No existe un usuario con ese correo' });

      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      const hashedTempPassword = await authService.hashPassword(tempPassword);
      await userService.updateUserPassword(usuario.nombre_usuario, hashedTempPassword);

      res.status(200).json({ 
        message: 'Se ha restablecido tu contraseña.',
        nueva_contrasena_temporal: tempPassword 
      });
    } catch (err) {
      next(err);
    }
  }

  // =========================
  // PERFIL
  // =========================
  async getProfile(req, res, next) {
    try {
      const username = req.user.nombre_usuario;
      const user = await userService.getUserByUsername(username);

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.status(200).json({
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        avatar: user.id_avatar_seleccionado,
        estilo: user.id_estilo_seleccionado
      });
    } catch (err) {
      next(err);
    }
  }

  // =========================
  // ACTUALIZAR PERFIL
  // =========================
  async updateProfile(req, res, next) {
    try {
      const username = req.user.nombre_usuario;
      const { correo } = req.body;
      await userService.setCorreoById(username, correo);
      res.status(200).json({ message: 'Perfil actualizado exitosamente' });
    } catch (err) {
      next(err);
    }
  }

  // =========================
  // CAMBIAR CONTRASEÑA
  // =========================
  async changePassword(req, res, next) {
    try {
      const username = req.user.nombre_usuario;
      const { contrasena_actual, nueva_contrasena } = req.body;

      const correcto = await authService.comprobarContraseñaActualCorrecta(username, contrasena_actual);
      if (!correcto) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

      const hashed = await authService.hashPassword(nueva_contrasena);
      await userService.updateUserPassword(username, hashed);
      res.status(200).json({ message: 'Contraseña actualizada' });
    } catch (err) {
      next(err);
    }
  }

  // =========================
  // CAMBIAR AVATAR
  // =========================
  async changeAvatar(req, res, next) {
    try {
      const username = req.user.nombre_usuario;
      const { avatar_id } = req.body;

      if (!avatar_id) {
        return res.status(400).json({ message: 'Debes proporcionar un avatar_id' });
      }

      //validar existencia
      const existe = await userService.existeAvatar(avatar_id);
      if (!existe) {
        return res.status(404).json({ message: 'El avatar no existe' });
      }

      // Validar propiedad
      const tieneAvatar = await userService.tieneAvatar(username, avatar_id);
      if (!tieneAvatar) {
        return res.status(403).json({ message: 'No posees este avatar' });
      }

      await userService.setIdAvatarSeleccionadoById(username, avatar_id);

      res.status(200).json({ message: 'Avatar actualizado' });

    } catch (err) {
      next(err);
    }
  }

  // =========================
  // CAMBIAR ESTILO
  // =========================
  async changeStyle(req, res, next) {
    try {
      const username = req.user.nombre_usuario;
      const { estilo_id } = req.body;

      if (!estilo_id) {
        return res.status(400).json({ message: 'Debes proporcionar un estilo_id' });
      }

      //Validar existencia
      const existe = await userService.existeEstilo(estilo_id);
      if (!existe) {
        return res.status(404).json({ message: 'El estilo no existe' });
      }

      // Validar propiedad
      const tieneEstilo = await userService.tieneEstilo(username, estilo_id);
      if (!tieneEstilo) {
        return res.status(403).json({ message: 'No posees este estilo' });
      }

      await userService.setIdEstiloSeleccionadoById(username, estilo_id);

      res.status(200).json({ message: 'Estilo actualizado' });

    } catch (err) {
      next(err);
    }
  }

  async getAvataresComprados(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const avatares = await userService.getAvataresComprados(username);

    res.status(200).json(avatares);
  } catch (err) {
    next(err);
  }
}

async getEstilosComprados(req, res, next) {
  try {
    const username = req.user.nombre_usuario;
    const estilos = await userService.getEstilosComprados(username);

    res.status(200).json(estilos);
  } catch (err) {
    next(err);
  }
}

}

module.exports = new UserController();