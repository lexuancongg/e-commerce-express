const authService = require("../../service/authService")
class authController {
    register(req, res, next) {
        const { passWord, userName, Email, phoneNumber } = req.body;
        authService.registerUser(passWord, userName, Email, phoneNumber)
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
    checkStatusAuth(req, res, next) {
        const token = req.headers.authorization.split(" ")[1];
        authService.getStatusAuth(token)
            .then(result => {
                return res.json(result.data)
            })
            .catch(next)
    }
    getDataAccountById(req, res, next) {
        const { idUser } = req;
        authService.getInformationAccountBuyId(idUser)
            .then(myAccount => {
                if (!myAccount) return res.status(404).json("not found")
                res.status(200).json(myAccount)
            }).catch(next)

    }
    async saveDataAboutAccount(req, res, next) {
        const newDataAccount = req.body;
        try {
            const result = await authService.saveAccountData(newDataAccount._id, newDataAccount);
            if (result.modifiedCount)
                return res.status(200).json(result);
            res.status(403).json("found");
        } catch (error) {
            next(error)
        }
    }

}
module.exports = new authController()