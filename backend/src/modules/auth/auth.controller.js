const authService = require('./authService');
const db = require('../../config/db');

exports.register = async (req, res, next) => {
  try {
    const { nombre_usuario, password, correo } = req.body;
    if (!nombre_usuario || !password || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const hashedPassword = await authService.hashPassword(password);

    const result = await db.query(
        'INSERT INTO notuno.USUARIO (nombre_usuario, contrasena, correo) VALUES ($1, $2, $3) RETURNING *',
        [nombre_usuario, hashedPassword, correo]
    );

    const user = result.rows[0];
    const token = authService.generateToken(user); // Mantienes el token con nombre_usuario

    res.status(201).json({ 
        token, 
        user: { nombre_usuario: user.nombre_usuario, correo: user.correo } 
    });
  } catch (err) {
      next(err);
  }
};

exports.login = async (req, res, next) => {
    try {
        const { nombre_usuario, password } = req.body;

        const user = await authService.loginUser(nombre_usuario, password);
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = authService.generateToken(user);

        res.json({ 
            token,
            user: { nombre_usuario: user.nombre_usuario }
        });
    } catch (err) {
        next(err);
    }
};

// ===================== MODIFICADO =====================
// /me usa nombre_usuario en vez de id
exports.me = async (req, res, next) => {
    try {
        const user = await userService.getUserByUsername(req.user.nombre_usuario);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.refresh = async (req, res) => res.json({ success: true, message: 'Pendiente implementar refresh token' });
exports.logout = async (req, res) => res.json({ success: true, message: 'Pendiente implementar logout' });