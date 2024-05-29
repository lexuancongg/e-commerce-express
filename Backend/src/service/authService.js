const User = require("../app/models/User");
const bcrypt = require("bcrypt")
const secretKey = 'ID_KJ_145';
const jwt = require('jsonwebtoken');
const card = require("../app/models/card");
const saltRounds = 10;

class authService {
    registerUser(password, userName, Email, phoneNumber) {
        return new Promise((resolve, reject) => {

            User.findOne({ $or: [{ userName }, { Email }, { phoneNumber }] }, { userName: 1, Email: 1, phoneNumber: 1 })
                .then(exists => {
                    if (exists) {
                        const message = userName === exists.toObject().userName ? 'Tên đăng nhập đã tồn tại' :
                            phoneNumber === exists.toObject().phoneNumber ? "Số điện thoại đã tồn tại" :
                                "Email đã tồn tại";
                        resolve({ message, type: false });
                    } else {
                        bcrypt.hash(password, saltRounds, function (err, hashPassword) {
                            if (err) {
                                reject(err);
                            } else {
                                const newAccount = new User({ ...req.body, password: hashPassword });
                                newAccount.save()
                                    .then(() => resolve({ type: true, data: newAccount }))
                                    .catch(error => reject(error));
                            }
                        });
                    }
                })
                .catch(error => reject(error));
        });
    }
    async checkAuthIsCorrect(userName, password) {
        try {
            const existingUser = await User.findOne({ userName });
            if (!existingUser) {
                return { message: 'không tìm thấy tài khoản', status: 404 };
            }
            const result = await bcrypt.compare(password, existingUser.passWord);
            if (!result) {
                return { message: 'mật khẩu không chính xác', status: 401 };
            }
            const token = jwt.sign({ idUser: existingUser._id, role: existingUser.role }, secretKey, { expiresIn: '10h' })
            return { token, status: 200 };
        } catch (error) {
            console.log(error)
            return { message: 'đăng nhập thất bại', status: 500, error };
        }
    }

    async getStatusAuth(token) {
        try {
            const decodedToken = jwt.verify(token, secretKey);
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
    async getInformationAccountBuyId(idUser) {
        try {
            const myAccount = await User.findOne({ _id: idUser }, { userName: 1, phoneNumber: 1, Email: 1, avatar: 1, name: 1 });
            return myAccount.toObject();
        } catch (error) {
            throw new Error(error)
        }
    }
    async saveAccountData(accountId, newData) {
        try {
            const response = await User.updateOne({ _id: accountId }, newData);
            if (response.nModified > 0) {
                return "Thành công";
            } else {
                throw new Error("Không tìm thấy tài khoản để cập nhật");
            }
        } catch (error) {
            throw new Error(`Lỗi khi lưu dữ liệu tài khoản: ${error.message}`);
        }
    }
    async findUserById(idUser) {
        return await User.findOne({ _id: idUser }, { avatar: 1, userName: 1 })
    }
}

module.exports = new authService();
