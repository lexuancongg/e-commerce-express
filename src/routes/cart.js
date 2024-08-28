const strategyPassport = require('../authentication/authPassport.js')
const passport = require('passport')
const localStrategy = passport.authenticate('local-strategy', { failWithError: true, session: false });
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const cartController = require('../controllers/cart.js')
module.exports = app => {
    app.post('/cart/add/:id', userAuth, cartController.addProduct)
    app.get('/cart/me', userAuth, cartController.getMyCart)
    app.delete("cart/deleteProduct/:id", userAuth, cartController.deleteProduct)
    app.delete("cart/deleteProducts", userAuth, cartController.deletedProductCheckedInCard)
}