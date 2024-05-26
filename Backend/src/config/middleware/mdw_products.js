const bill = require("../../app/models/bill");
const card = require("../../app/models/card");

class middwear_products {
    async changeWhenDeleteProducts(idProduct, next) {
        Promise.all([bill.delete({idProduct }), card.delete({ idProduct })])
            .then( async function ([products_deleted, cards_deleted]) {
                console.log("thanhf coong");
            }).catch(async function () {
               console.log("thats bai")
               next();
            }).finally(() => {
            })
    }
}
module.exports = new middwear_products();