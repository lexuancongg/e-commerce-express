const homeService = require('../../service/homeService')
class homeController {
    async getDataForHomePage(req, res, next) {
        try {
            const dataForHomePage = await homeService.getDataHomePage(req.params.page);
            if (!!dataForHomePage) {
                return res.status(200).json(dataForHomePage);
            }
            return res.status(500).json({ message: "có lỗi xảy ra" })
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new homeController()