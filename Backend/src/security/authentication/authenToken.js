const jwt = require('jsonwebtoken')
const secretKey = 'ID_KJ_145';
const authentoken = (req, res, next) => {
    // sau nàu sẽ dùng fetch gởi lên theo header nên cách lấy sẽ khác 
    const token = req.headers.authorization.split(" ")[1];
    // nếu lưu vào cooki thì nó sex tự động gán vào request 
    // const tokenCookie = req.cookies.token;
    if (token) {
        // kiểm tra
        jwt.verify(token, secretKey, (err, idUserToken) => {
            if (err || !idUserToken) {
                res.status(401).json({
                    errorCode: 'token không hợp lệ',
                    message: 'Bạn chưa đăng nhập'
                });
                return
            }
            // có result 
            // gán cho reques về tài khoản này đã được xác thực này để có thể truy cập tài khoản này ở những midweare khác
            // iduser ở đây chính là object về id và thời gian của token
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