const express = require('express');
const route = express.Router();
const passport = require("passport")
const userController = require('../controllers/users.js');
const strategyPassport = require('../authentication/authPassport.js')
const localStrategy = passport.authenticate('local-strategy', { failWithError: true, session: false });
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });


route.post('/user/create', userController.create)
// chưa hiểu vì sao không có bind thì không được và chưa xử lý khi nhập tài khoản sai
route.post('/user/login', localStrategy, userController.login.bind(userController))
// chưa xử lý 
route.get('/user/checkAuthStatus', userController.checkStatusAuth)

route.get("/user/me", userAuth, userController.getUserInfo)


route.get('/auth/google', passport.authenticate("google", {
    scope: ['profile'],
    failureRedirect: 'http://localhost:3001/register'
}))
route.get("/auth/google/redirect", function (req, res) {
    res.redirect('http://localhost:3001/register')
})


module.exports = route;


