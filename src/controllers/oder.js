const billService = require("../dbHelper/oder");
const productService = require("../dbHelper/product");
const customerService = require("../dbHelper/customerService")

class oderController {
    async getAllBill(req, res, next) {
        try {
            const datas = await billService.getAllBill();
            res.status(200).json(datas);
        } catch (error) {
            next(error);
        }
    }
    confirmBillById(req, res, next) {
        const idBill = req.params.id;
        billService.confirmBillById(idBill)
            .then(function (resultUpdate) {
                if (resultUpdate.modifiedCount) return res.status(200).json("true");
                res.status(404).json({ message: "found" });
            }).catch(next);
    }
    async getMybillWaitConfirm(req, res, next) {
        try {
            const datas = await billService.getMybillWaitConfirm();
            res.status(200).json(datas);
        } catch (error) {
            next(error);
        }
    }
    buyProduct = async (req, res, next) => {
        const { user } = req;
        const userId = user._id;
        const idProduct = req.params.id;
        const { informationBuyer, quantity, totalMoney } = req.body

        try {
            const customerIsExists = await customerService.findCustomerBuyId(userId);
            if (customerIsExists) {
                customerService.updateInformation(userId, informationBuyer)
            } else {
                customerService.createInformationCustomer(userId, ...informationBuyer);
            }
            const createBill = billService.createNewBill(userId, idProduct, quantity, totalMoney);
            const updateQuantityProduct = productService.updateQuantityProduct(idProduct, quantity, "down")
            Promise.all([createBill, updateQuantityProduct])
                .then(([responseBill, responseProduct]) => {
                    res.status(200).json("succes")
                })
        } catch (error) {
            next(error);
        }
    };
    async getInfoOder(req, res, next) {
        const { user } = req;
        const userId = user._id;
        const productId = req.params.id;
        try {
            const data = await billService.getProductAndCustomerInfo(productId, userId);
            return res.status(200).json(data)
        } catch (error) {
            next(error);
        }
    }
    async myBill({ user = {} }, res, next) {
        const userId = user._id;
        try {
            const myOders = await billService.getInformationOderBuyIdCustomer(userId);
            return res.status(200).json(myOders)
        } catch (error) {
            next(error)
        }
    }
    async buyProducts(req, res, next) {
        const orderItems = req.body.informationOderInCard;
        const { idUser } = req;
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

}
module.exports = new oderController()