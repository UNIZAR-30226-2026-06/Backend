// ================= WALLET CONTROLLER =================
const walletService = require('./walletService');

exports.getBalance = async (req, res, next) => {
    try {
        const nombre_usuario = req.user.nombre_usuario;
        const balance = await walletService.getBalance(nombre_usuario);
        res.json({ balance });
    } catch (err) {
        next(err);
    }
};

exports.addCoins = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await walletService.addCoins(nombre_usuario, amount);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.deductCoins = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await walletService.deductCoins(nombre_usuario, amount);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.purchaseAvatar = async (req, res, next) => {
    try {
        const { id_avatar } = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await walletService.purchaseAvatar(nombre_usuario, id_avatar);
        res.json(result);
    } catch (err) {
        next(err);
    }
};