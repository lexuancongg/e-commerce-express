const feetbackController = require('../controllers/feetback.js')
const passport = require('passport')
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
module.exports = app => {
    app.post('/feetback/:id', userAuth, feetbackController.createNewFeetback)
    app.get('/feetback/:id', feetbackController.getFeetBackProduct)
}