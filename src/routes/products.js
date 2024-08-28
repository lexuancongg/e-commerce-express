const productController = require('../controllers/product')
const passport = require('passport')
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const { permissionMiddleware } = require('../authentication/permission')
module.exports = app => {
    app.get('/product/infor/:id', productController.getInforProduct)
    app.get("/product/search", productController.searchByName)
    app.get("/product/productAtCategory/:slug", productController.productAtCategory)
    app.get('/product/page', productController.getProductsAtPage)
    app.post('/product/create', [userAuth, permissionMiddleware], productController.create);
    app.delete('/product/delete/:id', productController.deleteProduct)
    app.put('/product/update/:id', productController.updateProductById)
    app.get('/product/getInformationProduct/:id', productController.getProductById)
    app.get('/product/binProduct', productController.getProducDeleted)
    app.patch('product/restore/:id', productController.restoreProductById)
    app.delete('/product/permanentlyDeleted/:id', productController.permanentlyDeleteProductById)
    app.get("/product/myProducts", productController.getAllProducts)
}