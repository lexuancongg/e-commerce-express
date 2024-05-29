'use strict'
const User = require('../models/User.js');
const product = require('../models/product.js');

const chat = require('../models/chat.js')
const messageModel = require('../models/message.js')
const { default: mongoose } = require('mongoose');
const bill = require('../models/bill.js');
const homeService = require('../../service/homeService.js');
const authService = require('../../service/authService.js');
const productService = require('../../service/productService.js');
const customerService = require('../../service/customerService.js');
const billService = require('../../service/billService.js');
const cartService = require('../../service/cartService.js');
const feetbackProductService = require('../../service/feetbackProductService.js');
const chatService = require('../../service/chatService.js');
const sizeDataGet = 30;
class HomeContrailer {
    async Home(req, res, next) {
        try {
            const dataHomePage = await homeService.getDataHomePage(req.params.page);
            if (!!dataHomePage) {
                return res.status(200).json(dataHomePage);
            }
            return res.status(500).json({ message: "có lỗi xảy ra" })

        } catch (error) {
            next(error);
        }
    }

    register(req, res, next) {
        const { password, userName, Email, phoneNumber } = req.body;
        authService.registerUser(password, userName, Email, phoneNumber)
            .then(result => {
                if (result.type) {
                    return res.status(200).json(result.data);
                }
                res.status(409).json(result)
            }).catch(next)
    }

    async login(req, res, next) {
        const { userName, passWord } = req.body;
        try {
            const resultCheckAccount = await authService.checkAuthIsCorrect(userName, passWord);
            return res.status(resultCheckAccount.status).json(resultCheckAccount);
        } catch (error) {
            next(error);
        }
    }

    getInformationProduct(req, res, next) {
        const idProduct = req.params.id;
        productService.getInformationProductById(idProduct).then(informationResponse => {
            res.status(informationResponse.status).json(informationResponse.data);
        }).catch(next)
    }

    checkLoginStatus(req, res, next) {
        const token = req.headers.authorization.split(" ")[1];
        authService.getStatusAuth(token).then(result => {
            return res.json(result.data)
        }).catch(next)
    }

    payBuyProduct = async (req, res, next) => {
        const { idUser } = req.idUser;
        const idProduct = req.params.id;
        const { informationBuyer, quantity, totalMoney } = req.body
        try {
            const customerIsExists = customerService.findCustomerBuyId(idUser);
            if (customerIsExists) {
                customerService.updateInformation(idUser, req.body.informationBuyer)
            } else {
                customerService.createInformationCustomer(idUser, ...req.body.informationBuyer);
            }
            const newBill = new bill(
                {
                    idCustomer: idUser, idProduct: idProduct, quantityProduct: req.body.quantity, totalMoney: req.body.totalMoney
                }
            );
            Promise.all([newBill.save(), product.updateOne({ _id: idProduct }, { $inc: { quantity: - parseInt(req.body.quantity) } })])
                .then(([responseBill, responseProduct]) => {
                    if (responseBill && responseProduct) {
                        res.status(200).json("thành công")
                    }
                }).catch(next)
        } catch (error) {
            next(error);
        }
    };
    async getInformationOder(req, res, next) {
        const { idUser } = req.idUser
        const idProduct = req.params.id;
        try {
            const data = await productService.getProductAndCustomerInfo(idProduct, idUser);
            return res.status(200).json(data)

        } catch (error) {
            next(error);
        }
    }


    getDataMyAccount(req, res, next) {
        const { idUser } = req.idUser;
        authService.getInformationAccountBuyId(idUser).then(myAccount => {
            return res.status(200).json(myAccount)
        }).catch(next)

    }
    SearchProducts(req, res, next) {
        const keyWord = req.body.search;
        productService.findProductByName(keyWord).then(result => {
            res.cookie('resultSearch', JSON.stringify(result));
            res.redirect(`http://localhost:3001/ResultSearch`);
        }).catch(next)
    }

    async getDataMyOder(req, res, next) {
        const { idUser } = req.idUser;
        try {
            const myOders = await billService.getInformationOderBuyIdCustomer(idUser);
            return res.status(200).json(myOders)
        } catch (error) {
            next(error)
        }
    }
    addToCart(req, res, next) {
        const { idUser } = req.idUser;
        const idProduct = req.params.id;
        const { quantity } = req.body;
        cartService.addProductInCart(idUser, idProduct, quantity).then(result => {
            return res.status(200).json(result)
        }).catch(next)
    }

    async myCart(req, res, next) {
        const { idUser } = req.idUser;
        try {
            const cartDetails = await cartService.getUserCartDetails(idUser);
            res.status(200).json(cartDetails);
        } catch (error) {
            next(error);
        }
    }
    async saveDataAboutAccount(req, res, next) {
        const newDataAccount = req.body;
        try {
            const message = await authService.saveAccountData(newDataAccount._id, newDataAccount);
            res.status(200).json(message);
        } catch (error) {
            next(error)
        }
    }
    async deleteProductInCard(req, res, next) {
        const cardId = req.params.id;
        try {
            const message = await cartService.deleteProductInCart(cardId);
            if (message === "Thành công") {
                return res.status(200).json(message);
            } else {
                return res.status(404).json(message);
            }
        } catch (error) {
            next(error);
        }
    }
    async deletedProductCheckedInCard(req, res, next) {
        const cardIds = req.body.idCardProductChecked;
        try {
            const message = await cartService.deleteCheckedProductsInCart(cardIds);
            res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }

    async OderProductChecked(req, res, next) {
        const orderItems = req.body.informationOderInCard;
        const { idUser } = req.idUser
        try {
            const responses = await billService.createOrdersFromCart(idUser, orderItems);
            if (responses.length !== 0) {
                return res.status(200).json();
            } else {
                return res.status(404).json();
            }
        } catch (error) {
            next(error);
        }

    }
    async productAtCategory(req, res, next) {
        const slug = req.params.slug;
        try {
            const products = await productService.getProductsByCategory(slug);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async createNewFeetback(req, res, next) {
        const { content, idUser, idProduct } = req.body;
        try {
            const resultFeetback = await feetbackProductService.createNewFeedback(content, idUser, idProduct);
            return res.status(200).json(resultFeetback)
        } catch (error) {
            next()
        }
    }



    async getFeetBackProduct(req, res, next) {
        const productId = req.params.id;
        try {
            const feedbacks = await feetbackProductService.getFeedbacksForProduct(productId);
            res.status(200).json(feedbacks);
        } catch (error) {
            next(error);
        }
    }
    myOderWaitConfirm(req, res, next) {

    }


    async getChats(req, res, next) {
        const { idUser } = req.idUser;

        try {
            const myChats = await chatService.getChatsByUserId(idUser);
            if (myChats) {
                res.status(200).json(myChats);
            } else {
                res.status(404).json({ message: "Không tìm thấy trò chuyện." });
            }
        } catch (error) {
            next(error);
        }
    }


    async getDatalisproductAtPage(req, res, next) {
        const page = parseInt(req.query.page);
        try {
            const { listProductsAtPage, numberPages } = await productService.getProductListAtPage(page, sizeDataGet);
            res.status(200).json({ listProductsAtPage, numberPages });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new HomeContrailer();