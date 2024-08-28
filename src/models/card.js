const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const card = new Schema({
    idProduct: {
        type: String,
    },
    idUser: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    quantityProduct: {
        type: Number
    },
    size: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})
mongoose.plugin(slug);
card.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè những phương thức của monggo ví dụ như find() không lấy ht nữa mà chỉ lấy delete: flalse
    deletedAt: true
});
module.exports = mongoose.model('card', card)