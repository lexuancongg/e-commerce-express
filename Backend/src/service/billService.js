const bill = require("../app/models/bill")
const product = require("../app/models/product")
const converDate = require("../until/converDate")
const customer = require("../app/models/curtomer")

class billService {
    createNewBill() {

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
    async getStatistics() {
        try {
            const responseBill = await bill.findWithDeleted({}, { deleted: 0, updatedAt: 0, deletedAt: 0, __v: 0 });
            const datas = await Promise.all(responseBill.map(async (bill) => {
                const [responseCurtomer, responseProduct] = await Promise.all([
                    customer.findOneWithDeleted({ _id: bill.idCustomer }, { fullName: 1 }),
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
            return datas;
        } catch (error) {
            throw error;
        }
    }
    confirmBillById(idBill) {
        return bill.updateOne({ _id: idBill }, { status: 'confirm' })
    }
    async getDataMybills() {
        try {
            const responseBill = await bill.find({ status: 'Normal' }, {
                _id: 1, idProduct: 1, idCustomer: 1, quantityProduct: 1, totalMoney: 1, createdAt: 1
            });

            const datas = await Promise.all(responseBill.map(async (bill) => {
                const [responseCustomer, responseProduct] = await Promise.all([
                    customer.findOne({ _id: bill.idCustomer }, { fullName: 1, phoneNumberOrder: 1, address: 1 }),
                    product.findOne({ _id: bill.idProduct }, { name: 1, image: 1, _id: 1, price: 1 })
                ]);

                return {
                    ...bill?.toObject(),
                    ...responseCustomer?.toJSON(),
                    ...responseProduct?.toJSON(),
                    _idbill: bill._id,
                    dateOrder: converDate(bill.createdAt)
                };
            }));

            return datas;
        } catch (error) {
            throw error;
        }
    }
   
}
module.exports = new billService()
