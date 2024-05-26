
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const feetback = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
    },
    content: {
        type: String
    }
}, {
    timestamps: true    // tự động tạo colums ngày inssert vào dataabase 
})
mongoose.plugin(slug);
feetback.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè những phương thức của monggo ví dụ như find() không lấy ht nữa mà chỉ lấy delete: flalse
    deletedAt: true
});
module.exports = mongoose.model('feetback', feetback)