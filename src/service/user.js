
const User = require("../models/User");
const cart_db_helper = require('../dbHelper/cart')
const jwt = require('jsonwebtoken')


class userService {
    signToken = user => {
        return jwt.sign({ sub: user._id, role: user.role }, process.env.SERECT_KEY, { expiresIn: '10h' })
    }
    async getStatusAuth(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SERECT_KEY);
            const user = await User.findOne({ _id: decodedToken.sub });
            if (!user) {
                return { data: {}, type: false }
            }
            const quantityProductInCart = cart_db_helper.countDocuments(decodedToken.sub);
            return {
                data: {
                    role: user.role,
                    avatar: user.avatar,
                    quantityProductInCart,
                },
                status: true
            }
        } catch (error) {
            throw new Error(error)
        }
    }

}
module.exports = new userService();
