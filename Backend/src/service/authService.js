const User = require("../app/models/User");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const card = require("../app/models/card");
const saltRounds = 10;
class authService {
    async registerUser(password, userName, Email, phoneNumber) {
        try {
            const exists = await User.findOne({
                $or: [{ userName }, { Email }, { phoneNumber }]
            }, {
                userName: 1, Email: 1, phoneNumber: 1
            }).lean();
            if (exists) {
                const message = userName === exists.userName ? 'userName is exits' :
                    phoneNumber === exists.phoneNumber ? 'phoneNumber is exits' :
                        'email is exits';
                return { message, type: false };
            }
            console.log(password)
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const newAccount = new User({ userName, Email, phoneNumber, passWord: hashPassword });
            await newAccount.save();
            return { type: true, data: newAccount };
        } catch (error) {
            throw error;
        }
    }
    async checkAuthIsCorrect(userName, password) {
        try {
            const reusltFindUser = await User.findOne({ userName });
            if (!reusltFindUser) {
                return { message: 'account is not found', status: 404 };
            }
            const result = await bcrypt.compare(password, reusltFindUser.passWord);
            if (!result) {
                return { message: 'password is not correct', status: 401 };
            }
            const token = jwt.sign({ idUser: reusltFindUser._id, role: reusltFindUser.role }, process.env.SERECT_KEY, { expiresIn: '10h' })
            return { token, status: 200 };
        } catch (error) {
            throw error
        }
    }

    async getStatusAuth(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SERECT_KEY);
            const user = await User.findOne({ _id: decodedToken.idUser });
            if (!user) {
                return { data: {}, type: false }
            }
            const quantityProductInCart = await card.countDocuments({ idUser: decodedToken.idUser })
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

    getInformationAccountBuyId(idUser) {
        return User.findOne({ _id: idUser }, { userName: 1, phoneNumber: 1, Email: 1, avatar: 1, name: 1 });
    }

    saveAccountData(accountId, newData) {
        return User.updateOne({ _id: accountId }, newData)
    }
    async findUserById(idUser) {
        return await User.findOne({ _id: idUser }, { avatar: 1, userName: 1 })
    }
}

module.exports = new authService();
