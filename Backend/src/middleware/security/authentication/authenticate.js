const jwt = require('jsonwebtoken')
const authentoken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        // kiểm tra
        jwt.verify(token, process.env.SERECT_KEY, (err, idUserToken) => {
            if (err || !idUserToken) {
                res.status(401).json({
                    errorCode: 'token không hợp lệ',
                    message: 'Bạn chưa đăng nhập'
                });
                return
            }
            req.idUser = idUserToken;
            // tiếp tục các middwear sau
            next();
        })
    } else {
        return res.status(401).json({
            errorCode: 'bạn chưa đăng nhập',
            message: 'Bạn chưa đăng nhập'
        });

    }
}

module.exports = authentoken;