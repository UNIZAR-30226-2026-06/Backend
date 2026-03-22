const walletService = require('./walletService');

exports.getBalance = async (req, res, next) => {
  try {
    const coins = await walletService.getBalance(req.user.nombre_usuario);
    res.status(200).json({ coins });
  } catch (err) {
    next(err);
  }
};

exports.addCoins = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    const coins = await walletService.addCoins(req.user.nombre_usuario, amount);
    res.status(200).json({ coins });
  } catch (err) {
    next(err);
  }
};

exports.deductCoins = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    const coins = await walletService.deductCoins(req.user.nombre_usuario, amount);
    res.status(200).json({ coins });
  } catch (err) {
    next(err);
  }
};

exports.purchaseAvatar = async (req, res, next) => {
  try {
    const { id_avatar } = req.body;
    if (!id_avatar) return res.status(400).json({ message: 'id_avatar requerido' });

    const result = await walletService.purchaseAvatar(req.user.nombre_usuario, id_avatar);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.purchaseEstilo = async (req, res, next) => {
  try {
    const { id_estilo } = req.body;
    if (!id_estilo) return res.status(400).json({ message: 'id_estilo requerido' });

    const result = await walletService.purchaseEstilo(req.user.nombre_usuario, id_estilo);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};