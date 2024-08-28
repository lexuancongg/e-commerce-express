const user_db_helper = require("../dbHelper/users")
const jwt = require('jsonwebtoken')
const userService = require('../service/user')
class userController {
    create = (req, res, next) => {
        const { passWord, userName, Email, phoneNumber } = req.body;
        user_db_helper.create(passWord, userName, Email, phoneNumber)
            .then(result => {
                if (result.type) {
                    return res.status(200).json(result.data);
                }
                res.status(409).json(result)
            }).catch(next)
    }

    async login({ user = {} }, res, next) {
        // const { userName, passWord } = req.body;
        try {
            // const resultCheckAccount = await user_db_helper.checkUserIsCorrect(userName, passWord);
            // return res.status(resultCheckAccount.status).json(resultCheckAccount);
            return res.status(200).json(
                {
                    token: this.signToken(user)
                }
            )
        } catch (error) {
            next(error);
        }
    }
    checkStatusAuth(req, res, next) {
        const token = req.headers.authorization.split(" ")[1];
        userService.getStatusAuth(token)
            .then(result => {
                return res.json(result.data)
            })
            .catch(next)
    }

    getUserInfo(req, res, next) {
        // vì nếu là user của đối tượng monggodb thì nó là đặc biệt dùng delete không được 
        const user = req.user.toObject();
        try {
            delete user.passWord;
            return res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
    
    signToken(user) {
        return jwt.sign({ sub: user._id, role: user.role }, process.env.SERECT_KEY, { expiresIn: '10h' })
    }

}
module.exports = new userController()