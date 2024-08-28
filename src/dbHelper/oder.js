const bill = require("../models/oder")
const product = require("../models/product")
const converDate = require("../helpers/time")
const customer = require("../models/curtomer");



class bill_Db_Helper {
    createNewBill(idCustomer, idProduct, quantityProduct, totalMoney) {
        try {
            const newBill = new bill({ idCustomer, idProduct, quantityProduct, totalMoney });
            return newBill.save();
        } catch (error) {
            throw error
        }
    }
    async getInformationOderBuyIdCustomer(idCustomer) {
        const myOders = await bill.find({ idCustomer }, { idProduct: 1, totalMoney: 1, quantityProduct: 1, status: 1, createdAt: 1, _id: 1 })

        return Promise.all(myOders.map(function (myOder, index) {
            return product.findOneWithDeleted({ _id: myOder.idProduct }, { name: 1, image: 1, price: 1, _id: 1 })
                .then(function (responseProduct) {

                    return {
                        ...responseProduct?.toObject(),
                        ...myOder.toObject(),
                        idProduct: responseProduct._id,
                        idBill: myOder._id
                    }
                })
        }))

    }
    async createOrdersFromCart(userId, orderItems) {
        try {
            const promises = orderItems.map(item => {
                const { idProduct, quantity, price } = item;
                return new bill({
                    idCustomer: userId,
                    idProduct: idProduct,
                    quantityProduct: quantity,
                    totalMoney: quantity * price
                }).save();
            });

            const responses = await Promise.all(promises);
            return responses;
        } catch (error) {
            throw new Error(`Lỗi khi tạo đơn hàng từ giỏ hàng: ${error.message}`);
        }
    }
    async cancelOrderById(idBill) {
        try {
            const responseUpdate = await bill.updateOne({ _id: idBill }, { status: "cancel" });
            return responseUpdate ? true : false;
        } catch (error) {
            return false;
        }
    }
    async getAllBill() {
        try {
            const listBillsInBin = await bill.findWithDeleted({}, { deleted: 0, updatedAt: 0, deletedAt: 0, __v: 0 });
            const datas = await Promise.all(listBillsInBin.map(async (bill) => {
                const [responseCurtomer, responseProduct] = await Promise.all([
                    customer.findOneWithDeleted({ _id: bill.idCustomer }, { fullName: 1 }),
                    product.findOneWithDeleted({ _id: bill.idProduct }, { name: 1, _id: 1 })
                ]);
                return {
                    totalMoney: bill.totalMoney,
                    quantityProduct: bill.quantityProduct,
                    idBill: bill._id,
                    ...(responseCurtomer.toObject() ?? {}),
                    ...(responseProduct.toObject() ?? {}),
                    dateCreated: converDate(bill.createdAt)
                };
            }));
            return datas;
        } catch (error) {
            throw error;
        }
    }
    confirmBillById(idBill) {
        return bill.updateOne({ _id: idBill }, { status: 'confirm' })
    }
    async getMybillWaitConfirm() {
        try {
            const listBills = await bill.find({ status: 'Normal' }, {
                _id: 1, idProduct: 1, idCustomer: 1, quantityProduct: 1, totalMoney: 1, createdAt: 1
            }).lean();

            const datas = await Promise.all(listBills.map(async (bill) => {
                const [resultCustomer, resultProduct] = await Promise.all([
                    customer.findOne({ _id: bill.idCustomer }, { fullName: 1, phoneNumberOrder: 1, address: 1 }).lean(),
                    product.findOne({ _id: bill.idProduct }, { name: 1, image: 1, _id: 1, price: 1 }).lean()
                ]);
                console.log(bill)
                return {
                    ...(bill ?? {}),
                    ...(resultCustomer ?? {}),
                    ...(resultProduct ?? {}),
                    _idbill: bill._id ?? {},
                    dateOrder: converDate(bill.createdAt)
                };
            }));


            return datas;
        } catch (error) {
            throw new Error(error)

        }
    }
    async getProductAndCustomerInfo(productId, userId) {
        try {
            const productInfo = await product.findOne({ _id: productId }, { createdAt: 0, deleted: 0, updatedAt: 0 });
            const customerInfo = await customer.findOne({ _id: userId }, { createdAt: 0, deleted: 0, updatedAt: 0 });
            if (customerInfo) {
                return {
                    informationBuyer: customerInfo.toObject(),
                    informationProduct: productInfo.toObject()
                };
            }
            return {
                informationBuyer: false,
                informationProduct: productInfo.toObject()
            };
        } catch (error) {
            throw new Error(`Error fetching product and customer info: ${error.message}`);
        }
    }


}
module.exports = new bill_Db_Helper()
