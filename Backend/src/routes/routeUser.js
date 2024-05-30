const express = require('express');
const route = express.Router();
const authentoken = require("../middleware/security/authentication/authenticate.js");
const authController = require('../app/controllers/authController.js');
const productController = require('../app/controllers/productController.js');
const billController = require('../app/controllers/billController.js');
const cartController = require('../app/controllers/cartController.js');
const feetbackController = require('../app/controllers/feetbackController.js');
const chatController = require('../app/controllers/chatController.js');
const homeController = require('../app/controllers/homeController.js');

route.get('/informationProduct/:id', productController.getInformationProductById)
route.post('/feetback/:id', authentoken, feetbackController.createNewFeetback)
route.get('/', homeController.getDataForHomePage);
route.post('/register', authController.register)
route.post('/login', authController.login)
route.get('/checkLoginStatus', authController.checkStatusAuth)
route.post('/payBuyProduct/:id', authentoken, billController.doneBuyProduct)
route.get('/informationOder/:id', authentoken, billController.getInformationOder)
route.get("/myAccount", authentoken, authController.getDataAccountById)
route.get("/search", productController.searchProductsByname)
route.get('/myOder', authentoken, billController.getMyOder)
route.post('/addtocart/:id', authentoken, cartController.addToCart)
route.get('/mycart', authentoken, cartController.getMyCart)
route.delete("/deleteProductInCard/:id", authentoken, cartController.deleteProductInCard)
route.patch("/saveDataAboutAccount", authentoken, authController.saveDataAboutAccount)
route.delete("/deletedProductCheckedInCard", authentoken, cartController.deletedProductCheckedInCard)
route.post("/OderProductChecked", authentoken, billController.OderProductChecked)
route.get("/productAtCategory/:slug", productController.productAtCategory)
route.get('/feetback/:id', feetbackController.getFeetBackProduct)
route.get('/mychat', authentoken, chatController.getChatsByUserId)
route.get('/lisproductAtPage', productController.getListProductAtPage)


module.exports = route;
