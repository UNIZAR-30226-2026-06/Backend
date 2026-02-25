const authService = require('./authService');

exports.register = async (req, res, next) => {
  try {
    const { nombre_usuario, password } = req.body;
    const hashedPassword = await authService.hashPassword(password);
    res.status(201).json({ nombre_usuario, hashedPassword });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { nombre_usuario, password } = req.body;
    const isValid = await authService.authenticateUser(nombre_usuario, password);
    if (!isValid) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res) => {
  res.json({ success: true, message: 'Pendiente implementar refresh token' });
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Pendiente implementar logout' });
};

exports.me = async (req, res) => {
  res.json({ nombre_usuario: 'demo', coins: 50 });
};