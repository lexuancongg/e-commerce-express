
class customerController {
    async update(req, res, next) {
        const infoCustomer = req.body;
        try {
            const result = await user_db_helper.saveAccountData(infoCustomer._id, infoCustomer);
            if (result.modifiedCount)
                return res.status(200).json(result);
            res.status(403).json("found");
        } catch (error) {
            next(error)
        }
    }
}
module.exports = new customerController();