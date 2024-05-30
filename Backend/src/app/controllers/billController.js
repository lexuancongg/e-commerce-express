const billService = require("../../service/billService");
const productService = require("../../service/productService");
const customerService = require("../../service/customerService")

class billController {
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
    doneBuyProduct = async (req, res, next) => {
        const { idUser } = req.idUser;
        const idProduct = req.params.id;
        const { informationBuyer, quantity, totalMoney } = req.body

        try {
            const customerIsExists = await customerService.findCustomerBuyId(idUser);
            if (customerIsExists) {
                customerService.updateInformation(idUser, informationBuyer)
            } else {
                customerService.createInformationCustomer(idUser, ...informationBuyer);
            }
            const createBill = billService.createNewBill(idUser, idProduct, quantity, totalMoney);
            const updateQuantityProduct = productService.updateQuantityProduct(idProduct, quantity, "down")
            Promise.all([createBill, updateQuantityProduct])
                .then(([responseBill, responseProduct]) => {
                    res.status(200).json("succes")
                })
        } catch (error) {
            next(error);
        }
    };
    async getInformationOder(req, res, next) {
        const { idUser } = req.idUser
        const idProduct = req.params.id;
        try {
            const data = await billService.getProductAndCustomerInfo(idProduct, idUser);
            return res.status(200).json(data)
        } catch (error) {
            next(error);
        }
    }
    async getMyOder(req, res, next) {
        const { idUser } = req.idUser;
        try {
            const myOders = await billService.getInformationOderBuyIdCustomer(idUser);
            return res.status(200).json(myOders)
        } catch (error) {
            next(error)
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

}
module.exports = new billController()