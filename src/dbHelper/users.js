const User = require("../models/User");
const jwt = require('jsonwebtoken');
const card = require("../models/card");
const { hash, compare } = require("../helpers/bcrypt");
const saltRounds = 10;
class users {
    async create(password, userName, Email, phoneNumber) {
        try {
            let user = await User.findOne({
                $or: [{ userName }, { Email }, { phoneNumber }]
            }, {
                userName: 1, Email: 1, phoneNumber: 1
            }).lean();
            if (user) {
                const message = userName === user.userName ? 'userName is exits' :
                    phoneNumber === user.phoneNumber ? 'phoneNumber is exits' :
                        'email is exits';
                return { message, type: false };
            }
            const hashPassword = await hash(password, saltRounds);
            user = new User({ userName, Email, phoneNumber, passWord: hashPassword });
            await user.save();
            return { type: true, data: user };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async checkUserIsCorrect(userName, password) {

        try {
            const user = await User.findOne({ userName });
            if (!user) {
                return { message: 'account is not found', status: 404, type: false };
            }
            const result = await compare(password, user.passWord);
            if (!result) {
                return { message: 'password is not correct', status: 401, type: false };
            }
            // const token = jwt.sign({ sub: user._id, role: user.role }, process.env.SERECT_KEY, { expiresIn: '10h' })
            // return { token, status: 200 };
            return { type: true, data: user, status: 200 };
        } catch (error) {
            throw new Error(error.message)
        }
    }




    saveAccountData(accountId, newData) {
        return User.updateOne({ _id: accountId }, newData)
    }
    async findUserById(idUser) {
        return await User.findOne({ _id: idUser }, { avatar: 1, userName: 1 })
    }
}

module.exports = new users();
