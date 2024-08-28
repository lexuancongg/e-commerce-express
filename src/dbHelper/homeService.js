
const bill = require("../models/oder");
const product = require("../models/product");
const category = require("../models/category");
const sizeDataGet = 30;
class homeService {
    async getDataHomePage() {
        try {

            const productsPromise = product.find({}).limit(sizeDataGet);
            const categoriesPromise = category.find({});

            const [listProducts, listCategories] = await Promise.all([productsPromise, categoriesPromise]);

            const top3Product = await bill.aggregate([
                {
                    $group: {
                        _id: '$idProduct',
                        totalQuantitySold: { $sum: '$quantityProduct' }
                    }
                },
                {
                    $sort: { totalQuantitySold: -1 }
                },
                { $limit: 3 }
            ]);

            const top3ProductDetails = await Promise.all(top3Product.map(async (item) => {
                const productDetail = await product.findOne({ _id: item._id }, { name: 1, image: 1 });
                return productDetail;
            }));
            return { listProducts, listCategories, top3ProductDetails }
        } catch (error) {
            throw new Error("Error deleting product and related bills: ' + error.message");
        }
    }

}
module.exports = new homeService();