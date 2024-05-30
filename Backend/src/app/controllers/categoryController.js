const categoryService = require('../../service/categoryService')
class categoryController{
    async addCategory(req, res, next) {
        try {
            const resultCategory = await categoryService.addCategory(req.body);
            res.status(200).json(resultCategory);
        } catch (error) {
            next(error);
        }
    }
    async getCategory(req, res, next) {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new categoryController()