const card = require("../app/models/card");
const product = require("../app/models/product");

class cartService {
    addProductInCart(idUser, idProduct, quantity) {
        return new card({ idProduct, idUser: idUser, quantityProduct: quantity, size: "M", }).save()

    }

    async getUserCartDetails(idUser) {
        try {
            const listCard = await card.find({ idUser }, { idProduct: 1, quantityProduct: 1, _id: 1 }).sort({ createdAt: -1 });
            const promises = listCard.map(async (cart) => {
                const productDetails = await product.findOne({ _id: cart.idProduct }, { name: 1, price: 1, image: 1, _id: 1 });
                return {
                    idCard: cart._id,
                    ...productDetails?.toObject(),
                    quantity: cart.quantityProduct
                };
            });
            const cartDetails = await Promise.all(promises);
            return cartDetails;
        } catch (error) {
            throw new Error(`Error fetching user cart details: ${error.message}`);
        }
    }
    deleteProductInCart(cardId) {
        return card.deleteOne({ _id: cardId })
    }
    deleteCheckedProductsInCart(cardIds) {
        return card.deleteMany({ _id: { $in: cardIds } })
    }

    // tìm những giỏ hàng có chứa sp muốn tìm 
    findCartByIdProduct(idProduct) {
        return card.find({ idProduct }, { _id: 1 });
    }

    // xóa mềm giỏ hàng khi sản phẩm đó được xóa mềm
    async deleteCartById(idCart) {
        try {
            return await card.delete({ _id: idCart });
        } catch (error) {
            throw new Error(error);
        }
    }

}
module.exports = new cartService();