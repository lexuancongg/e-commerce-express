const cartService = require("../../service/cartService");

class cartController {
    addToCart(req, res, next) {
        const { idUser } = req;
        const idProduct = req.params.id;
        const { quantity } = req.body;
        cartService.addProductInCart(idUser, idProduct, quantity)
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
    async deleteProductInCard(req, res, next) {
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