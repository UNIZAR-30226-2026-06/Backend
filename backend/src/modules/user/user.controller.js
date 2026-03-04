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
      if (!correo) return res.status(400).json({ error: 'Debes proporcionar un correo' });

      const usuario = await userService.getUserByEmail(correo);
      if (!usuario) return res.status(404).json({ error: 'No existe un usuario con ese correo' });

      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      const hashedTempPassword = await authService.hashPassword(tempPassword);
      await userService.updateUserPassword(usuario.nombre_usuario, hashedTempPassword);

      res.status(200).json({ 
        mensaje: 'Se ha restablecido tu contraseña.',
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

      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      res.json({
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
      res.json({ mensaje: 'Perfil actualizado' });
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
      if (!correcto) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

      const hashed = await authService.hashPassword(nueva_contrasena);
      await userService.updateUserPassword(username, hashed);
      res.json({ mensaje: 'Contraseña actualizada' });
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
      await userService.setIdAvatarSeleccionadoById(username, avatar_id);
      res.json({ mensaje: 'Avatar actualizado' });
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
      await userService.setIdEstiloSeleccionadoById(username, estilo_id);
      res.json({ mensaje: 'Estilo actualizado' });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new UserController();