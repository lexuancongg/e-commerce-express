const cartService = require("../dbHelper/cart");

class cartController {
    addProduct(req, res, next) {
        const userId = req.user._id;
        const idProduct = req.params.id;
        const { quantity } = req.body;
        cartService.addProductInCart(userId, idProduct, quantity)
            .then(result => {
                return res.status(200).json(result)
            }).catch(next)
    }

    async getMyCart(req, res, next) {
        const { idUser } = req;
        try {
            const cartDetails = await cartService.getMyCartByIdUser(idUser);
            res.status(200).json(cartDetails);
        } catch (error) {
            next(error);
        }
    }
    async deleteProduct(req, res, next) {
        const cardId = req.params.id;
        try {
            const result = await cartService.deleteProductInCart(cardId);
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }
    async deletedProductCheckedInCard(req, res, next) {
        const cardIds = req.body.idCardProductChecked;
        try {
            const result = await cartService.deleteCheckedProductsInCart(cardIds);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new cartController()