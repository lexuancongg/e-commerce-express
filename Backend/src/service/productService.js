const bill = require("../app/models/bill");
const card = require("../app/models/card");
const product = require("../app/models/product");
const { default: mongoose } = require('mongoose');
class productService {
    getInformationProductById(idProduct) {
        return Promise.all([
            product.findOne({ _id: idProduct }, { name: 1, price: 1, image: 1, quantity: 1, nameCategory: 1 }),
            bill.aggregateWithDeleted([
                {
                    $match: {
                        idProduct: new mongoose.Types.ObjectId(idProduct)
                    }
                },
                {
                    $group: {
                        _id: "$idProduct",
                        totalQuantitySold: { $sum: "$quantityProduct" },
                    }
                }
            ])
        ]).then(async ([resultFindProduct, [resultBill]]) => {
            if (resultFindProduct) {
                const responseCategory = await product.find({ nameCategory: resultFindProduct.nameCategory, _id: { $ne: resultFindProduct._id } }, { name: 1, image: 1, price: 1 });
                return {
                    data: {
                        ...resultFindProduct.toObject(),
                        totalQuantitySold: resultBill?.totalQuantitySold || 0,
                        listProductAtCategory: responseCategory,
                    },
                    status: 200
                };
            }
            return { data: {}, status: 404 };
        }).catch((error) => { throw new Error(error) });
    }

    findProductByName(keyWord) {
        const arrayKeyWords = keyWord.split(" ");
        const regexPattern = arrayKeyWords.map(keyword => `(?=.*${keyword})`).join('');
        const regex = new RegExp(regexPattern, 'i');
        return product.find({ name: { $regex: regex } })

    }

    async getProductsByCategory(slug) {
        try {
            return await product.find({ nameCategory: slug }, { name: 1, price: 1, image: 1, _id: 1 });
        } catch (error) {
            throw new Error(`Lỗi khi lấy sản phẩm trong danh mục: ${error.message}`);
        }
    }
    
    async getProductListAtPage(page, sizeDataGet) {
        try {
            const skipCount = (page - 1) * sizeDataGet;
            const listProductsPromise = product.find({}).skip(skipCount).limit(sizeDataGet);
            const totalProductsPromise = product.estimatedDocumentCount();
            const [listProductsAtPage, totalProducts] = await Promise.all([listProductsPromise, totalProductsPromise]);
            const numberPages = Math.ceil(totalProducts / sizeDataGet);
            return { listProductsAtPage, numberPages };
        } catch (error) {
            throw new Error(error);
        }
    }
    createProduct(name, price, quantity, image, nameCategory) {
        return new product({ name, price, quantity, image, nameCategory }).save({});
    }
    async deleteProduct(idProduct) {
        try {
            const resultDelete = await product.delete({ _id: idProduct });
            this.updateDataCartAndBillWhenDeleteProduct(card, idProduct, false);
            this.updateDataCartAndBillWhenDeleteProduct(bill, idProduct, false)
            return resultDelete
        } catch (error) {
            throw new Error(error);
        }
    }
    async permanentlyDeleteById(idProduct) {
        try {
            const result = await product.deleteOne({ _id: idProduct })
            this.updateDataCartAndBillWhenDeleteProduct(card, idProduct, true);
            this.updateDataCartAndBillWhenDeleteProduct(bill, idProduct, true)
        } catch (error) {
            throw new Error(error)
        }
    }
    getDataProductById(idProduct) {
        return product.findOne({ _id: idProduct },{name:1,price:1,image:1});
    }
    async updateProductById(idProduct, newData) {
        return await product.updateOne({ _id: idProduct }, newData);
    }

    async getProductInBin() {
        return await product.findDeleted({});
    }

    async restoreProductById(idProduct) {
        try {
            const result = await product.updateOneDeleted({ _id: idProduct }, { $set: { deleted: false } });
            this.updateDataCartAndBillWhenRestoreProduct(card, idProduct);
            this.updateDataCartAndBillWhenRestoreProduct(bill, idProduct);
            return result
        } catch (error) {
            throw new Error(error);
        }
    }

    updateQuantityProduct(idProduct, quantity, type) {
        if (type === "up") {
            return product.updateOne({ _id: idProduct }, { $inc: { quantity: + quantity } })
        }
        product.updateOne({ _id: idProduct }, { $inc: { quantity: - quantity } })
    }


    async getAllProducst() {
        return await product.find({});
    }
    async updateDataCartAndBillWhenDeleteProduct(modelSchema, idProduct, type) {
        // tim modal chứa id sản phẩm xóa
        const listId = await modelSchema.find({ idProduct }, { _id: 1 })
        // xóa với id của model
        listId.forEach(async (id) => {
            type ? await modelSchema.deleteOne({ _id: id }) : await modelSchema.delete({ _id: id })
        })
    }
    async updateDataCartAndBillWhenRestoreProduct(modelSchema, idProduct) {
        const listId = await modelSchema.findDeleted({ idProduct }, { _id: 1 })
        listId.forEach(async (id) => {
            await modelSchema.updateOneDeleted({ _id: id }, { $set: { deleted: false } });
        })
    }



}
module.exports = new productService();