const express = require('express');
const route = express.Router();
const HomeContrailer = require('../app/controllers/HomeContrailer.js');
const authentoken = require("../security/authentication/authenToken.js")

route.get('/informationProduct/:id', HomeContrailer.getInformationProduct)
route.post('/feetback/:id', authentoken, HomeContrailer.createNewFeetback)
route.get('/', HomeContrailer.Home);
route.post('/newMessage', authentoken, HomeContrailer.createNewmessage)
route.post('/register', HomeContrailer.register)
route.post('/login', HomeContrailer.login)
route.get('/checkLoginStatus', HomeContrailer.checkLoginStatus)
route.post('/payBuyProduct/:id', authentoken, HomeContrailer.payBuyProduct)
route.get('/informationOder/:id', authentoken, HomeContrailer.getInformationOder)
route.get("/myAccount", authentoken, HomeContrailer.getDataMyAccount)
route.get("/search", HomeContrailer.SearchProducts)
route.get('/myOder', authentoken, HomeContrailer.getDataMyOder)
route.post('/addtocart/:id', authentoken, HomeContrailer.addToCart)
route.get('/mycart', authentoken, HomeContrailer.myCart)
route.delete("/deleteProductInCard/:id", authentoken, HomeContrailer.deleteProductInCard)
route.patch("/saveDataAboutAccount", authentoken, HomeContrailer.saveDataAboutAccount)
route.delete("/deletedProductCheckedInCard", authentoken, HomeContrailer.deletedProductCheckedInCard)
route.post("/OderProductChecked", authentoken, HomeContrailer.OderProductChecked)
route.get("/productAtCategory/:slug", HomeContrailer.productAtCategory)
route.get('/feetback/:id', HomeContrailer.getFeetBackProduct)
route.get('/myOderWaitConfirm', authentoken, HomeContrailer.myOderWaitConfirm)
route.get('/mychat', authentoken, HomeContrailer.getChats)
route.get('/lisproductAtPage',HomeContrailer.getDatalisproductAtPage)


module.exports = route;
