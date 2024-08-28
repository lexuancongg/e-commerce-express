const passport = require('passport')
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const customerController = require('../controllers/customer')
module.exports = app => {
    app.patch("/customer/me/update", userAuth, customerController.update)
}