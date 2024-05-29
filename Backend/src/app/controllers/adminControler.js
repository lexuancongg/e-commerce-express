
const productService = require('../../service/productService.js');
const billService = require('../../service/billService.js');
const categoryService = require('../../service/categoryService.js');
const chatService = require('../../service/chatService.js');

class adminControler {
    // thêm sản phẩm
    createProduct(req, res, next) {
        const { name, price, quantity, image, nameCategory } = req.body;
        productService.createProduct(name, price, quantity, image, nameCategory)
            .then(() => res.redirect('http://localhost:3001/ProductManagament'))
            .catch(next)
    }
    // xóa mềm 
    async deleteProduct(req, res, next) {
        try {
            await productService.deleteProduct(req.params.id);
            res.redirect("http://localhost:3001/ProductManagament");
        } catch (error) {
            next(error);
        }
    }
    // lấy thông tin sản phẩm qua id
    async getDataProductById(req, res, next) {
        try {
            const idProduct = req.params.id;
            const productData = await productService.getDataProductById(idProduct);
            res.status(200).json(productData);
        } catch (error) {
            next(error);
        }
    }

    // chỉnh sửa thông tin sản phẩm
    async updateProduct(req, res, next) {
        try {
            const newDataProduct = req.body;
            const idProduct = req.params.id;
            const response = await productService.updateProductById(idProduct, newDataProduct);
            if (response.modifiedCount) {
                return res.status(200).json();
            }
            res.status(403).json()
        } catch (error) {
            next(error);
        }
    }

    // lấy sản phẩm đã xóa mềm
    async getProductInBin(req, res, next) {
        try {
            const productsInBin = await productService.getProductInBin();
            res.status(200).json(productsInBin);
        } catch (error) {
            next(error);
        }
    }
    // khôi phục sản phẩm khỏi xóa mềm
    async restoreProduct(req, res, next) {
        try {
            await productService.restoreProductById(req.params.id);
            res.redirect("http://localhost:3001/ProductManagament");
        } catch (error) {
            next(error);
        }
    }
    // xóa vĩnh viễn sản phẩm
    permanentlyDeleted(req, res, next) {
        const id_Product = req.params.id;
        productService.permanentlyDeleteById(id_Product)
            .then(function (response) {
                res.send('<script>window.history.go(-1);</script>');
            }).catch(next)
    }

    async statistical(req, res, next) {
        try {
            const datas = await billService.getStatistics();
            res.status(200).json(datas);
        } catch (error) {
            next(error);
        }
    }

    confirmBill(req, res, next) {
        const idBill = req.params.id;
        billService.confirmBillById(idBill).then(function (resultUpdate) {
            if (resultUpdate.modifiedCount) return res.status(200).json("true");
            res.status(404).json({ message: "found" });
        }).catch(next);
    }
    async getDataMybills(req, res, next) {
        try {
            const datas = await billService.getDataMybills();
            res.status(200).json(datas);
        } catch (error) {
            next(error);
        }
    }
    async addCategory(req, res, next) {
        try {
            const resultCategory = await categoryService.addCategory(req.body);
            res.status(200).json(resultCategory);
        } catch (error) {
            next(error);
        }
    }

    async myProducts(req, res, next) {
        try {
            const listProducts = await productService.getAllProducst();
            res.status(200).json(listProducts);
        } catch (error) {
            next(error);
        }
    }

    async getCategory(req, res, next) {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getChats(req, res, next) {
        try {
            const data = await chatService.getChats();
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }

    }
    async GetcontentChatId(req, res, next) {
        try {
            const { id } = req.params;
            const chat = await chatService.getContenchatById(id);
            if (chat) {
                return res.status(200).json(chat);
            }
            res.status(404).json({ message: 'Chat not found.' });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new adminControler(); 