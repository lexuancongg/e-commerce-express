
const product = require('../models/product.js');
const bill = require("../models/bill.js");
const curtomer = require('../models/curtomer.js');
const converDate = require('../../until/converDate.js');
const category = require('../models/category.js');
const chat = require('../models/chat.js');
const User = require('../models/User.js');
const message = require('../models/message.js');
const mdw_products = require('../../config/middleware/mdw_products.js');



class adminControler {
    // thêm sản phẩm
    createProduct(req, res, next) {
        const newProduct = new product(req.body);
        newProduct.save().then(() => res.redirect('http://localhost:3001/ProductManagament')).catch(next)
    }
    // xóa mềm 
    async deleteProduct(req, res, next) {
        product.delete({ _id: req.params.id })
            .then((response) => {
                mdw_products.changeWhenDeleteProducts(req.params.id, next);
                res.redirect("http://localhost:3001/ProductManagament")
            }).catch(next)
    }
    // lấy thông tin sản phẩm qua id
    getDataProductById(req, res, next) {
        const idProduct = req.params.id
        product.findOne({ _id: idProduct })
            .then(response => res.status(200).json(response)).catch(next)
    }

    // chỉnh sửa thông tin sản phẩm
    updateProduct(req, res, next) {
        const newInformation = req.body;
        product.updateOne({ _id: req.params.id }, newInformation).
            then((response) => {
                if (response.modifiedCount) return res.status(200).json();
                return res.status(404).json()
            })
            .catch(next)
    }
    // lấy sản phẩm đã xóa mềm
    getProductInBin(req, res, next) {
        product.findDeleted({})
            .then(response => res.status(200).json(response))
            .catch(next)
    }
    // khôi phục sản phẩm khỏi xóa mềm
    restoreProduct(req, res, next) {
        product.updateOneDeleted({ _id: req.params.id }, { $set: { deleted: false } })
            .then((response) => res.send('<script>window.history.go(-1);</script>'))
            .catch(next)
    }
    // xóa vĩnh viễn sản phẩm
    permanentlyDeleted(req, res, next) {
        const id_Product = req.params.id;
        product.deleteOne({ _id: id_Product })
            .then(function (response) {
                res.send('<script>window.history.go(-1);</script>');
            }).catch(next)
    }
    async statistical(req, res, next) {
        try {
            const responseBill = await bill.findWithDeleted({}, { deleted: 0, updatedAt: 0, deletedAt: 0, __v: 0 });
            const datas = await Promise.all(responseBill.map(async (bill) => {
                const [responseCurtomer, responseProduct] = await Promise.all([
                    curtomer.findOneWithDeleted({ _id: bill.idCustomer }, { fullName: 1 }),
                    product.findOneWithDeleted({ _id: bill.idProduct }, { name: 1, _id: 1 })
                ]);
                return {
                    totalMoney: bill.totalMoney,
                    quantityProduct: bill.quantityProduct,
                    idBill: bill._id,
                    ...(responseCurtomer?.toObject() ?? {}),
                    ...(responseProduct?.toObject() ?? {}),
                    dateCreated: converDate(bill.createdAt)
                };
            }));
            res.status(200).json(datas);
        } catch (error) {
            next(error);
        }
    }

    confirmBill(req, res, next) {
        const idBill = req.params.id;
        bill.updateOne({ _id: idBill }, { status: 'confirm' }).then(function (response) {
            if (response) return res.status(200).json(response);
            res.status(404).json({ message: "Không tìm thấy hoá đơn" });
        }).catch(next);
    }
    getDataMybills(req, res, next) {
        bill.find({ status: 'Normal' }, { _id: 1, idProduct: 1, idCustomer: 1, quantityProduct: 1, totalMoney: 1, createdAt: 1 })
            .then(function (responseBill) {
                Promise.all(responseBill.map(function (bill) {
                    return Promise.all([
                        curtomer.findOne({ _id: bill.idCustomer }, { fullName: 1, phoneNumberOder: 1, address: 1 }),
                        product.findOne({ _id: bill.idProduct }, { name: 1, image: 1, _id: 1, price: 1 })
                    ])
                        .then(function ([responseCurtomer, responseProduct]) {
                            return {
                                ...bill?.toObject(),
                                ...responseCurtomer?.toJSON(),
                                ...responseProduct?.toJSON(),
                                _idbill: bill._id,
                                dateOder: converDate(bill.createdAt)
                            };
                        }).catch(next);
                }))
                    .then(function (datas) {
                        res.status(200).json(datas)
                    })
                    .catch(next);
            }).catch(next);
    }
    addCategory(req, res, next) {
        const newCategory = new category(req.body);
        newCategory.save().then(response => {
            if (response) res.status(200).json("thành công")
        }).catch(next)
    }
    myProducts(req, res, next) {
        product.find({}).then(response => {
            res.status(200).json(response)
        }).catch(next)
    }
    getCategory(req, res, next) {
        category.find({}, { _id: 1, name: 1 }).then(response => res.status(200).json(response)).catch(next)
    }
    getChats(req, res, next) {
        chat.find({}, { _id: 1, lastMessage: 1 }).sort({ updatedAt: -1 }).then(informationChat => {
            if (informationChat.length) {
                // có thể dùng cách lấy lengt rồi lấy phẩn tử cuối thay cho lassmessage trong db 
                return Promise.all(informationChat.map(eachChat =>
                    User.findOne({ _id: eachChat._id }, { userName: 1, avatar: 1 }).then(response => ({ ...response.toObject(), lastMessage: eachChat.lastMessage })).catch(next)
                ))
            }
        }).then(data => {
            return res.status(200).json(data)
        }).catch(next)
    }
    GetcontentChatId(req, res, next) {
        const { id } = req.params;
        chat.findOne({ _id: id }, { chats: 1, _id: 1 }).sort({ updatedAt: -1 }).then(contentChat => {
            if (contentChat) return res.status(200).json(contentChat.toObject())
        }).catch(next)
    }
    async adminReplyMess(idChat, idAdmin, messageAnswer) {
        const answer = new message({ _id: idAdmin, content: messageAnswer });
        const update = await chat.updateOne({ _id: idChat }, { lastMessage: answer, $push: { chats: answer } })
        if (update.modifiedCount) {
            return { newMessage: answer.toObject(), lastMessage: answer.toObject() }
        }
        return false
    }
}

module.exports = new adminControler(); 