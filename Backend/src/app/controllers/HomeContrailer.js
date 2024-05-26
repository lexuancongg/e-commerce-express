'use strict'
const User = require('../models/User.js');
const category = require('../models/category.js')
const product = require('../models/product.js');
const card = require('../models/card.js')
const curtomer = require("../models/curtomer.js")
const chat = require('../models/chat.js')
const messageModel = require('../models/message.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const bill = require('../models/bill.js');
const feetback = require('../models/feetback.js')
const feetbackProduct = require('../models/feetbackProduct.js');
const secretKey = 'ID_KJ_145';
const saltRounds = 10;
// số  lượng lấy ra từ database
const sizeDataGet = 30;
// BẢN CHẤT NHƯ SQL SEVER 
class HomeContrailer {
    async Home(req, res, next) {
        try {
            const products = product.find({}).skip(0).limit(sizeDataGet);
            Promise.all([products, category.find({})]).then(async ([responseProduct, responseCategory]) => {
                try {
                    const top3Product = await bill.aggregateWithDeleted([
                        {
                            $group: {
                                // group theo idProduct 
                                _id: '$idProduct',
                                // group va tinh tong
                                totalQuantitySold: { $sum: '$quantityProduct' }
                            }
                        },
                        {
                            // sap xep theo total..: giam dan
                            $sort: { totalQuantitySold: -1 }
                        },
                        { $limit: 3 }
                    ])

                    Promise.all(top3Product.map((item) => {
                        return product.findOne({ _id: item._id }, { name: 1, image: 1 }).then((response) => response).catch(next)
                    })).then(function (data) {
                        res.status(200).json(
                            {
                                listProducts: responseProduct,
                                listCategorys: responseCategory,
                                top3Product: data
                            })
                    })

                } catch (error) {
                    next();
                }
            }).catch(next)

        }
        catch (err) {
            res.status(400).send({
                error: "erro"
            })
        }
    }
    register(req, res, next) {
        const { passWord, userName, Email, phoneNumber } = req.body;
        // kiểm tra xem đã có ai sử dụng các thuộc tính này chưa 
        User.findOne({ $or: [{ userName }, { Email }, { phoneNumber }] }, { userName: 1, Email: 1, phoneNumber: 1 })
            .then(exits => {
                if (exits) {
                    const message = userName === exits.toObject().userName ? 'Tên đăng nhập đã tồn tại' : phoneNumber === exits.toObject().phoneNumber ? "số điện thoại đã tồn tại" : "Email đã tồn tại";
                    return res.status(409).json({ message });
                }
                else {
                    // băm mật khẩu 
                    bcrypt.hash(passWord, saltRounds, function (err, hashPassWord) {
                        if (hashPassWord) { // hash mật khẩu sau khi băm 
                            const newAccount = new User({ ...req.body, passWord: hashPassWord });
                            newAccount.save()
                                .then(function (response) {
                                    return res.status(200).json(response);
                                })
                                .catch(next)
                        } else {
                            return next()
                        }
                    });
                }
            }).catch(next)
    }


    login(req, res, next) {
        const { userName, passWord } = req.body;
        User.findOne({ userName })
            .then(responseUser => {

                if (!responseUser) {
                    return res.status(404).json({ message: 'không tìm thấy tài khoản' })
                }
                bcrypt.compare(passWord, responseUser.passWord, function (err, result) {
                    if (err || !result) {
                        return res.status(401).json({ message: 'mật khẩu không chính xác' })
                    }
                    const token = jwt.sign({ idUser: responseUser._id, role: responseUser.role }, secretKey, { expiresIn: '10h' }, function (err, token) {
                        if (token) {
                            return res.status(200).json({ token });
                        }
                        res.status(500).json({ message: "đănh nhập thất bại" })
                    })
                    // có thể lưu cooki bằng sever ở đây bằng library cooki seach cookie npm
                })

                // cách viết khác thep then
                // bcrypt.compare(passWord, responseUser.passWord)
                //     .then(result => {
                //         if (result) {
                //             res.json('đúng mật khẩu')
                //         }
                //     }).catch(next)
            })
            .catch(next)
    }
    getInformationProduct(req, res, next) {
        const id_product = req.params.id;
        Promise.all(
            [
                product.findOne({ _id: id_product }, { name: 1, price: 1, image: 1, quantity: 1, nameCategory: 1 }),
                bill.aggregateWithDeleted([
                    {
                        $match: {
                            idProduct: new mongoose.Types.ObjectId(id_product) // match có công dụng lọc như find kèm điều kiện => bản chất như having
                        }
                    },
                    {
                        $group: {
                            _id: "$idProduct",
                            totalQuantitySold: { $sum: "$quantityProduct" },
                        }
                    }
                ])
            ]
        ).then(([responseProduct, [responseInsertBill]]) => {
            if (responseProduct) {
                product.find({ nameCategory: responseProduct.nameCategory, _id: { $ne: responseProduct._id } }, { name: 1, image: 1, price: 1 })
                    .then(responseCategory => {
                        res.status(200).json({
                            ...responseProduct.toObject(),
                            totalQuantitySold: responseInsertBill?.totalQuantitySold || 0,
                            listProductAtCategory: responseCategory
                        })
                    }).catch(next)
            }
        }).catch(next)
    }

    checkLoginStatus(req, res, next) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            jwt.verify(token, secretKey, function (err, dataToken) {
                if (err || !dataToken) {
                    return res.status(401).json("chưa đăng nhập");
                }
                User.findOne({ _id: dataToken.idUser })
                    .then(response => {
                        if (response) {
                            const user = JSON.parse(JSON.stringify(response));
                            // lấy thông tin giỏ hàng 
                            card.countDocuments({ idUser: dataToken.idUser })
                                .then(responseQuantity => {
                                    return res.status(200).json({ role: user.role === 'admin' ? 'admin' : 'user', avatar: response.avatar, quantityCard: responseQuantity });
                                })
                                .catch(next);
                        } else {
                            return res.status(401).json("chưa đăng nhập");
                        }
                    })
                    .catch(next);
            });
        } else {
            return res.status(401).json("chưa đăng nhập");
        }
    }

    payBuyProduct = async (req, res, next) => {
        try {
            const { idUser } = req.idUser;
            const idProduct = req.params.id;

            const customerExists = await curtomer.findOne({
                _id: idUser, phoneNumberOder: { $exists: true, $ne: "" }, address: { $exists: true, $ne: "" }, fullName: { $exists: true, $ne: "" }
            });
            if (customerExists) {
                const responseUpdate = await curtomer.updateOne({ _id: idUser }, { _id: idUser, ...req.body.informationBuyer });
            } else {
                const newCustomer = new curtomer({ _id: idUser, ...req.body.informationBuyer });
                const responseSaveNewUser = await newCustomer.save();
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
    getInformationOder(req, res, next) {
        const { idUser } = req.idUser
        const _idProduct = req.params.id;
        Promise.all([product.findOne({ _id: _idProduct }, { createdAt: 0, deleted: 0, updatedAt: 0 }), curtomer.findOne({ _id: idUser }, { createdAt: 0, deleted: 0, updatedAt: 0 })])
            .then(function ([responseProduct, responseCurtomer]) {
                if (responseCurtomer) {
                    return res.status(200).json(
                        {
                            informationBuyer: responseCurtomer.toObject(),
                            informationProduct: responseProduct.toObject()
                        }
                    )

                }
                return res.status(200).json(
                    {
                        informationBuyer: false,
                        informationProduct: responseProduct.toObject()
                    }
                )

            }).catch(next)
    }
    getDataMyAccount(req, res, next) {
        const { idUser } = req.idUser;
        Promise.all([User.findOne({ _id: idUser }, { userName: 1, phoneNumber: 1, Email: 1, avatar: 1 }), curtomer.findOne({ _id: idUser }, { fullName: 1, address: 1 })])
            .then(function ([responseUser, responseCurtomer]) {
                if (responseUser && responseCurtomer) {
                    const DataMyAccount = {
                        ...responseUser.toObject(),
                        ...responseCurtomer.toObject(),
                        _id: responseUser.toObject()._id

                    }
                    return res.status(200).json(DataMyAccount)

                }
            }).catch(next)

    }
    SearchProducts(req, res, next) {
        const keyWord = req.body.search;
        const arrayKeyWords = keyWord.split(" ");
        const regexPattern = arrayKeyWords.map(keyword => `(?=.*${keyword})`).join('');
        const regex = new RegExp(regexPattern, 'i');
        product.find({ name: { $regex: regex } })
            .then((responseSearch) => {
                res.cookie('resultSearch', JSON.stringify(responseSearch));
                res.redirect(`http://localhost:3001/ResultSearch`);
                return;
            })
            .catch(next);
    }
    getDataMyOder(req, res, next) {
        const { idUser } = req.idUser;
        bill.find({ idCustomer: idUser }, { idProduct: 1, totalMoney: 1, quantityProduct: 1, status: 1, createdAt: 1, deleted: 1, _id: 1 })
            .then(function (responseMyOders) {
                Promise.all(responseMyOders.map(function (responseMyOder, index) {
                    return product.findOneWithDeleted({ _id: responseMyOder.idProduct }, { name: 1, image: 1, price: 1, _id: 1 })
                        .then(function (responseProduct) {
                            return {
                                ...responseProduct.toObject(),
                                ...responseMyOder.toObject(),
                                idProduct: responseProduct._id,
                                idBill: responseMyOder._id
                            }
                        }).catch(next)
                })).then(data => res.json(data))
                    .catch(next)
            }).catch(next)
    }
    addToCart(req, res, next) {
        const { idUser } = req.idUser;
        const idProduct = req.params.id;
        const { quantity } = req.body;
        const newProduct = new card({ idProduct, idUser: idUser, quantityProduct: quantity, size: "M", });
        newProduct.save().then(function (response) {
            res.status(200).json({ message: "thành công" })
        }).catch(next)
    }
    myCart(req, res, next) {
        const { idUser } = req.idUser;
        card.find({ idUser: idUser }, { idProduct: 1, quantityProduct: 1, _id: 1 }).sort({ createdAt: -1 }).then(responsesCart => {
            const promises = responsesCart.map(function (response) {
                return product.findOneWithDeleted({ _id: response.idProduct }, { name: 1, price: 1, image: 1, _id: 1 })
                    .then(product => (
                        {
                            idCard: response._id,
                            ...product.toObject(),
                            quantity: response.quantityProduct
                        }
                    )) 
                    .catch(next);
            })
            return Promise.all(promises)
        })
            .then(data => res.status(200).json(data))
            .catch(next)
    }
    saveDataAboutAccount(req, res, next) {
        const newDataAccount = req.body;
        User.updateOne({ _id: newDataAccount._id }, newDataAccount)
            .then((response) => res.status(200).json("thành công"))
            .catch(next)
    }
    deleteProductInCard(req, res, next) {
        card.deleteOne({ _id: req.params.id }).then(response => {
            if (response) return res.status(200).json("thanh cong");

            return res.status(404).json("that bai")
        }).catch(next)
    }
    deletedProductCheckedInCard(req, res, next) {
        card.deleteMany({ _id: { $in: req.body.idCardProductChecked } })
            .then(response => res.status(200).json())
            .catch(next)
    }
    OderProductChecked(req, res, next) {
        const dataAboutOder = req.body.informationOderInCard;
        const { idUser } = req.idUser
        const promises = dataAboutOder.map(item =>
            new bill({ idCustomer: idUser, idProduct: item.idProduct, quantityProduct: item.quantity, totalMoney: item.quantity * item.price }).save()
                .then(response => response).catch(next)
        )
        return Promise.all(promises).then(data => {
            if (data.length !== 0) return res.status(200).json();
            return res.status(404).json()
        }).catch(next)

    }
    productAtCategory(req, res, next) {
        product.find({ nameCategory: req.params.slug }, { name: 1, price: 1, image: 1, _id: 1 })
            .then(response => res.status(200).json(response))
            .catch(next)
    }

    async createNewFeetback(req, res, next) {
        const { content, idUser, idProduct } = req.body;
        console.log(idProduct)
        try {
            const newFeetback = new feetback({ content, idUser });
            const responseNewfeetBack = await newFeetback.save({}, { $sort: { createdAt: -1 } });
            if (responseNewfeetBack) {
                const personFeetback = await User.findOne({ _id: idUser }, { avatar: 1, userName: 1 })
                const responseExist = await feetbackProduct.findOne({ _id: idProduct });
                if (responseExist) {
                    const responseUpdate = await feetbackProduct.updateOne(
                        { _id: idProduct },
                        { $set: { feetbacks: [...responseExist.feetbacks, responseNewfeetBack] } }
                    );
                    if (responseUpdate) return res.status(200).json({ ...newFeetback.toObject(), ...personFeetback.toObject() });
                } else {
                    // tạo mới cho feetback
                    const createNewFeetbackProduct = await new feetbackProduct({ _id: idProduct, feetbacks: [responseNewfeetBack] }).save()
                    if (createNewFeetbackProduct) return res.status(200).json({ ...newFeetback.toObject(), ...personFeetback.toObject() })
                }
            }
        } catch (error) {
            next()
        }
    }
    getFeetBackProduct(req, res, next) {
        feetbackProduct.findOne({ _id: req.params.id }, { feetbacks: 1 }).then(responseExist => {
            if (!responseExist) return res.status(200).json([])
            Promise.all(responseExist.feetbacks.map(feetback => User.findOne({ _id: feetback.idUser }, { avatar: 1, userName: 1 })
                .then(responseUser => ({ ...responseUser.toObject(), content: feetback.content }))
                .catch(next)
            )).then(dataFeetback => res.status(200).json(dataFeetback))
                .catch(next)

        }).catch(next)
    }
    myOderWaitConfirm(req, res, next) {

    }
    canCelOder(idBill) {
        return bill.updateOne({ _id: idBill }, { status: "cancel" }).then(responseUpdate => {
            if (responseUpdate) return true;
            return false
        }).catch(() => {
            return false
        })
    }
    async createNewmessage(idUser, message) {
        const converIduserToObjectId = (idString) => new mongoose.Types.ObjectId(idString)
        const newMessage = new messageModel({ _id: converIduserToObjectId(idUser), content: message })
        // kieemx tra xem từng có cuộc trò chuyện chưa
        try {
            const checkExistChat = await chat.findOne({ _id: converIduserToObjectId(idUser) }, { chats: 1 })
            const informationUserChat = await User.findOne({ _id: converIduserToObjectId(idUser) }, { avatar: 1, userName: 1, _id: 1 })
            if (checkExistChat) {
                // thêm vào mảng
                const checkUpdate = await chat.updateOne({ _id: converIduserToObjectId(idUser) }, { lastMessage: newMessage, $push: { chats: newMessage } });
                // trả về số tài liệu được cập nhật
                if (checkUpdate.modifiedCount) return { newMessage: newMessage.toObject(), lastMessage: newMessage };
                return false;
            }
            // tạo mới chat
            const newChat = await new chat({ _id: converIduserToObjectId(idUser), chats: [newMessage], lastMessage: newMessage }).save({}, { $sort: { createdAt: -1 } });
            if (newChat) return { newMessage: newMessage.toObject(), newUserChat: informationUserChat }
        } catch (error) {
            return false
        }
    }
    getChats(req, res, next) {
        const { idUser } = req.idUser;
        chat.findOne({ _id: idUser }, { chats: 1, _id: 1 }).sort({ updatedAt: -1 }).then(myChats => {
            if (myChats) return res.status(200).json(myChats.toObject())
        }).catch(next)
    }
    async getDatalisproductAtPage(req, res, next) {
        const page = parseInt(req.query.page);
        try {
            if (page) {
                const listProductsAtPage = await product.find({}).skip((page - 1) * sizeDataGet).limit(sizeDataGet)
                const numberPages = Math.ceil(await product.estimatedDocumentCount() / sizeDataGet);
                return res.status(200).json({ listProductsAtPage, numberPages })
            }
        } catch (error) {
            next();
        }
    }


}

module.exports = new HomeContrailer();