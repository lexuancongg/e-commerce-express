const express = require('express');
const route = express.Router();
const controllersAdmin = require('../app/controllers/adminControler.js');
const authentoken = require('../middleware/security/authentication/authenticate.js');
route.post('/create', controllersAdmin.createProduct);
route.delete('/delete/:id', controllersAdmin.deleteProduct)
route.put('/edit/:id', controllersAdmin.updateProduct)
route.get('/getInformationProduct/:id', controllersAdmin.getDataProductById)
route.get('/binProduct', controllersAdmin.getProductInBin)
route.patch('/restore/:id', controllersAdmin.restoreProduct)
route.delete('/permanentlyDeleted/:id', controllersAdmin.permanentlyDeleted)
route.get("/statistical", controllersAdmin.statistical)
route.delete("/confirmBill/:id", controllersAdmin.confirmBill)
route.get("/myBills", controllersAdmin.getDataMybills)
route.post("/addcategory", controllersAdmin.addCategory)
route.get("/myProducts", controllersAdmin.myProducts)
route.get('/category', controllersAdmin.getCategory)
route.get('/chatAdmin', controllersAdmin.getChats)
route.get('/getcontentchat/:id', authentoken, controllersAdmin.GetcontentChatId)
module.exports = route;