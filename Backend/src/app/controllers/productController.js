const cartService = require("../../service/cartService");
const productService = require("../../service/productService");

class productController {
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
    async getProductById(req, res, next) {
        try {
            const idProduct = req.params.id;
            const productData = await productService.getDataProductById(idProduct);
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
    async getProducDeleted(req, res, next) {
        try {
            const productsInBin = await productService.getProductInBin();
            res.status(200).json(productsInBin);
        } catch (error) {
            next(error);
        }
    }
    // khôi phục sản phẩm khỏi xóa mềm
    async restoreProductById(req, res, next) {
        try {
            await productService.restoreProductById(req.params.id);
            res.redirect("http://localhost:3001/ProductManagament");
        } catch (error) {
            next(error);
        }
    }
    // xóa vĩnh viễn sản phẩm
    permanentlyDeleteProductById(req, res, next) {
        const id_Product = req.params.id;
        productService.permanentlyDeleteById(id_Product)
            .then(function (response) {
                res.send('<script>window.history.go(-1);</script>');
            }).catch(next)
    }
    async getAllProducts(req, res, next) {
        try {
            const listProducts = await productService.getAllProducst();
            res.status(200).json(listProducts);
        } catch (error) {
            next(error);
        }
    }
    getInformationProductById(req, res, next) {
        const idProduct = req.params.id;
        productService.getInformationProductById(idProduct)
            .then(informationResponse => {
                res.status(informationResponse.status).json(informationResponse.data);
            }).catch(next)
    }
    searchProductsByname(req, res, next) {
        const keyWord = req.body.search;
        productService.findProductByName(keyWord)
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
        const slug = req.params.slug;
        try {
            const products = await productService.getProductsByCategory(slug);
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
    async getListProductAtPage(req, res, next) {
        const page = parseInt(req.query.page);
        try {
            const { listProductsAtPage, numberPages } = await productService.getProductListAtPage(page, sizeDataGet);
            res.status(200).json({ listProductsAtPage, numberPages });
        } catch (error) {
            next(error);
        }
    }


}
module.exports = new productController()