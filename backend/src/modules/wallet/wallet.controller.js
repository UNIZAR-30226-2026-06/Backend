const walletService = require('./walletService');

exports.getBalance = async (req, res, next) => {
    try {
        const nombre_usuario = req.user.nombre_usuario;
        const coins = await walletService.getBalance(nombre_usuario);
        res.status(200).json({ coins });
    } catch (err) {
        if (err.name === 'UnauthorizedError') return res.status(401).json({ message: 'No autorizado' });
        next(err);
    }
};

exports.addCoins = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: 'Cantidad inválida' });

        const nombre_usuario = req.user.nombre_usuario;
        const coins = await walletService.addCoins(nombre_usuario, amount);
        res.status(200).json({ coins });
    } catch (err) {
        if (err.name === 'UnauthorizedError') return res.status(401).json({ message: 'No autorizado' });
        next(err);
    }
};

exports.deductCoins = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: 'Cantidad inválida' });

        const nombre_usuario = req.user.nombre_usuario;
        const coins = await walletService.deductCoins(nombre_usuario, amount);

        if (coins === null) return res.status(400).json({ message: 'Fondos insuficientes o cantidad inválida' });

        res.status(200).json({ coins });
    } catch (err) {
        if (err.name === 'UnauthorizedError') return res.status(401).json({ message: 'No autorizado' });
        next(err);
    }
};

exports.purchaseAvatar = async (req, res, next) => {
    try {
        const { avatarId } = req.body;
        if (!avatarId) return res.status(400).json({ message: 'Avatar inválido' });

        const nombre_usuario = req.user.nombre_usuario;
        const { coins, avatarUnlocked } = await walletService.purchaseAvatar(nombre_usuario, avatarId);

        if (!avatarUnlocked) return res.status(400).json({ message: 'No hay monedas suficientes o avatar inválido' });

        res.status(200).json({ coins, avatarUnlocked });
    } catch (err) {
        if (err.name === 'UnauthorizedError') return res.status(401).json({ message: 'No autorizado' });
        next(err);
    }
};