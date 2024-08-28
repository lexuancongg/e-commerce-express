const categoryController = require('../controllers/category')
module.exports = app => {
    app.post("/category/addcategory", categoryController.addCategory)
    app.get('/category/get', categoryController.getCategory)

}