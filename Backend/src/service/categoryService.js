const category = require("../app/models/category");

class categoryService {
    async addCategory({ name, avatar }) {
        return new category({ name, avatar }).save()
    }
    getCategories() {
        return category.find({}, { _id: 1, name: 1 });
    }
}
module.exports = new categoryService()