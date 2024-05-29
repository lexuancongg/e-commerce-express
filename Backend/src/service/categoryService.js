const category = require("../app/models/category");

class categoryService {
    async addCategory(categoryData) {
        const newCategory = new category(categoryData);
        try {
            const response = await newCategory.save();
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getCategories() {
        try {
            const categories = await category.find({}, { _id: 1, name: 1 });
            return categories;
        } catch (error) {
            throw new Error(error);
        }

    }
}
module.exports = new categoryService()