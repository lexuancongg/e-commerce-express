const express = require('express');
const route = express.Router();
const authentoken = require('../middleware/security/authentication/authenticate.js');
const productController = require('../app/controllers/productController.js');
const billController = require('../app/controllers/billController.js');
const categoryController = require('../app/controllers/categoryController.js');
const chatController = require('../app/controllers/chatController.js');
route.post('/create', productController.createProduct);
route.delete('/delete/:id', productController.deleteProduct)
route.put('/edit/:id', productController.updateProductById)
route.get('/getInformationProduct/:id', productController.getProductById)
route.get('/binProduct', productController.getProducDeleted)
route.patch('/restore/:id', productController.restoreProductById)
route.delete('/permanentlyDeleted/:id', productController.permanentlyDeleteProductById)
route.get("/statistical", billController.getAllBill)
route.delete("/confirmBill/:id", billController.confirmBillById)
route.get("/myBills", billController.getMybillWaitConfirm)
route.post("/addcategory", categoryController.addCategory)
route.get("/myProducts", productController.getAllProducts)
route.get('/category', categoryController.getCategory)
route.get('/chatAdmin', chatController.getChats)
route.get('/getcontentchat/:id', authentoken, chatController.getcontentChatById)
module.exports = route;