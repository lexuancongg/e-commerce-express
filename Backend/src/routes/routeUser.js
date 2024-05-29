const express = require('express');
const route = express.Router();
const userController = require('../app/controllers/userController.js');
const authentoken = require("../middleware/security/authentication/authenticate.js")

route.get('/informationProduct/:id', userController.getInformationProduct)
route.post('/feetback/:id', authentoken, userController.createNewFeetback)
route.get('/', userController.Home);
route.post('/register', userController.register)
route.post('/login', userController.login)
route.get('/checkLoginStatus', userController.checkLoginStatus)
route.post('/payBuyProduct/:id', authentoken, userController.payBuyProduct)
route.get('/informationOder/:id', authentoken, userController.getInformationOder)
route.get("/myAccount", authentoken, userController.getDataMyAccount)
route.get("/search", userController.SearchProducts)
route.get('/myOder', authentoken, userController.getDataMyOder)
route.post('/addtocart/:id', authentoken, userController.addToCart)
route.get('/mycart', authentoken, userController.myCart)
route.delete("/deleteProductInCard/:id", authentoken, userController.deleteProductInCard)
route.patch("/saveDataAboutAccount", authentoken, userController.saveDataAboutAccount)
route.delete("/deletedProductCheckedInCard", authentoken, userController.deletedProductCheckedInCard)
route.post("/OderProductChecked", authentoken, userController.OderProductChecked)
route.get("/productAtCategory/:slug", userController.productAtCategory)
route.get('/feetback/:id', userController.getFeetBackProduct)

route.get('/mychat', authentoken, userController.getChats)
route.get('/lisproductAtPage',userController.getDatalisproductAtPage)


module.exports = route;
