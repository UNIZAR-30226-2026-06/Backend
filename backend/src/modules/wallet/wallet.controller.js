const walletService = require('./wallet.service');

exports.getBalance = async (req, res, next) => {
    try {
        const nombre_usuario = req.user.nombre_usuario;
        const balance = await walletService.getBalance(nombre_usuario);
        res.json({ balance });
    } catch (error) {
        next(error);
    }
};

exports.addCoins = async (req, res, next) => {
    try {
        const {amount} = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await walletService.addCoins(nombre_usuario, amount);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

exports.deductCoins = async (req, res, next) => {
    try {
        const {amount} = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await walletService.deductCoins(nombre_usuario, amount);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

exports.purchaseAvatar = async (req, res,next) => {
    try {
        const {id_avatar} = req.body;
        const nombre_usuario = req.user.nombre_usuario;
        const result = await wallerService.purchaseAvatar(nombre_usuario, id_avatar);
        res.json(result);
    }
    catch(error){
        next(error);
    }
};

