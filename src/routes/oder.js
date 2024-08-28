const billController = require('../controllers/oder.js')
const strategyPassport = require('../authentication/authPassport.js');
const passport = require('passport')
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
module.exports = app => {
    app.post('/bill/buy/:id', userAuth, billController.buyProduct)
    app.get('/bill/informationOder/:id', userAuth, billController.getInfoOder)
    app.get('bill/me', userAuth, billController.myBill)
    app.post("/bill/buys", userAuth, billController.buyProducts)
    app.get("/bill/myBills", billController.getMybillWaitConfirm)
    app.get("/bill/statistical", billController.getAllBill)
    app.delete("/bill/confirmBill/:id", billController.confirmBillById)
}