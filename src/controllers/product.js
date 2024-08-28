const cartService = require("../dbHelper/cart");
const product_db_helper = require("../dbHelper/product");

const sizeDataGet = 30;
class productController {
    // thêm sản phẩm
    create(req, res, next) {
        const { name, price, quantity, image, nameCategory } = req.body;
        product_db_helper.createProduct(name, price, quantity, image, nameCategory)
            .then(() => res.redirect('http://localhost:3001/ProductManagament'))
            .catch(next)
    }
    // xóa mềm 
    async deleteProduct(req, res, next) {
        
        try {
            await product_db_helper.deleteProduct(req.params.id);
            res.redirect("http://localhost:3001/ProductManagament");
        } catch (error) {
            next(error);
        }
    }
    // lấy thông tin sản phẩm qua id
    async getProductById(req, res, next) {
        try {
            const idProduct = req.params.id;
            const productData = await product_db_helper.getDataProductById(idProduct);
            res.status(200).json(productData);
        } catch (error) {
            next(error);
        }
    }
    // chỉnh sửa thông tin sản phẩm
    async updateProductById(req, res, next) {
        try {
            const newDataProduct = req.body;
            const idProduct = req.params.id;
            const response = await product_db_helper.updateProductById(idProduct, newDataProduct);
            if (response.modifiedCount) {
                return res.status(200).json();
            }
            res.status(403).json()
        } catch (error) {
            next(error);
        }
    }
    // lấy sản phẩm đã xóa mềm
    async getProducDeleted(req, res, next) {
        try {
            const productsInBin = await product_db_helper.getProductInBin();
            res.status(200).json(productsInBin);
        } catch (error) {
            next(error);
        }
    }
    // khôi phục sản phẩm khỏi xóa mềm
    async restoreProductById(req, res, next) {
        try {
            await product_db_helper.restoreProductById(req.params.id);
            res.redirect("http://localhost:3001/ProductManagament");
        } catch (error) {
            next(error);
        }
    }
    // xóa vĩnh viễn sản phẩm
    permanentlyDeleteProductById(req, res, next) {
        const id_Product = req.params.id;
        product_db_helper.permanentlyDeleteById(id_Product)
            .then(function (response) {
                res.send('<script>window.history.go(-1);</script>');
            }).catch(next)
    }
    async getAllProducts(req, res, next) {
        try {
            const listProducts = await product_db_helper.getAllProducst();
            res.status(200).json(listProducts);
        } catch (error) {
            next(error);
        }
    }
    getInforProduct(req, res, next) {
        const idProduct = req.params.id;
        product_db_helper.getInformationProductById(idProduct)
            .then(informationResponse => {
                res.status(informationResponse.status).json(informationResponse.data);
            }).catch(next)
    }
    searchByName(req, res, next) {
        const keyWord = req.body.search;
        product_db_helper.searchByName(keyWord)
            .then(result => {
                res.cookie('resultSearch', JSON.stringify(result));
                res.redirect(`http://localhost:3001/ResultSearch`);
            }).catch(next)
    }
    async deleteProductInCard(req, res, next) {
        const cardId = req.params.id;
        try {
            const result = await cartService.deleteProductInCart(cardId);
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }
    async productAtCategory(req, res, next) {
        const {slug} = req.params;
        try {
            const products = await product_db_helper.getProductsByCategory(slug);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
    async getProductsAtPage(req, res, next) {
        const page = parseInt(req.query.page);
        try {
            const { listProductsAtPage, numberPages } = await product_db_helper.getProductListAtPage(page, sizeDataGet);
            res.status(200).json({ listProductsAtPage, numberPages });
        } catch (error) {
            next(error);
        }
    }


}
module.exports = new productController()