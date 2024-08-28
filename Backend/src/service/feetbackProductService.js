const User = require("../app/models/User");
const feetback = require("../app/models/feetback");
const feetbackProduct = require("../app/models/feetbackProduct");


class feetbackProductService {

    async createNewFeedback(content, idUser, idProduct) {
        try {
            const newFeetback = new feetback({ content, idUser });
            const resultNewfeetBack = await newFeetback.save({}, { $sort: { createdAt: -1 } });
            if (resultNewfeetBack) {
                const personFeetback = await User.findOne({ _id: idUser }, { avatar: 1, userName: 1 })
                const checkFeetbackIsExists = await feetbackProduct.findOne({ _id: idProduct });
                if (checkFeetbackIsExists) {
                    const responseUpdate = await feetbackProduct.updateOne(
                        { _id: idProduct },
                        { $set: { feetbacks: [...checkFeetbackIsExists.feetbacks, resultNewfeetBack] } }
                    );
                    if (responseUpdate) return ({ ...newFeetback.toObject(), ...personFeetback.toObject() });
                } else {
                    // tạo mới cho feetback
                    const createNewFeetbackProduct = await new feetbackProduct({ _id: idProduct, feetbacks: [resultNewfeetBack] }).save()
                    if (createNewFeetbackProduct) return { ...newFeetback.toObject(), ...personFeetback.toObject() }
                }
            }
        } catch (error) {
            throw new Error(`Lỗi khi tạo phản hồi: ${error.message}`);
        }
    }
    async getFeedbacksForProduct(productId) {
        try {
            const responseExist = await feetbackProduct.findOne({ _id: productId }, { feetbacks: 1 });
            if (!responseExist) return [];
            const promises = responseExist.feetbacks.map(async (feetback) => {
                const user = await User.findOne({ _id: feetback.idUser }, { avatar: 1, userName: 1 });
                return { ...user.toObject(), content: feetback.content };
            });

            const dataFeetback = await Promise.all(promises);
            return dataFeetback;
        } catch (error) {
            throw new Error(`Lỗi khi lấy phản hồi của sản phẩm: ${error.message}`);
        }
    }
}
module.exports = new feetbackProductService();