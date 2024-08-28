
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const feetback = require('./feetback')
const feetbackProduct = new Schema({
    feetbacks: {
        type: [feetback.schema]
    }
}, {
    timestamps: true    // tự động tạo colums ngày inssert vào dataabase 
})
mongoose.plugin(slug);
feetbackProduct.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè sự lấy ht của mongo
    deletedAt: true
});
module.exports = mongoose.model('feetbackproduct', feetbackProduct)


