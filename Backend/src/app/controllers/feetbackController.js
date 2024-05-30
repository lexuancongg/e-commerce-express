const feetbackProductService = require("../../service/feetbackProductService")
class feetbackController{
    async createNewFeetback(req, res, next) {
        const { content, idUser, idProduct } = req.body;
        try {
            const resultFeetback = await feetbackProductService.createNewFeedback(content, idUser, idProduct);
            return res.status(200).json(resultFeetback)
        } catch (error) {
            next()
        }
    }
    async getFeetBackProduct(req, res, next) {
        const productId = req.params.id;
        try {
            const feedbacks = await feetbackProductService.getFeedbacksForProduct(productId);
            res.status(200).json(feedbacks);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new feetbackController()