
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const curtomer = new Schema({
    fullName: {
        type: String,
        default: ""
    }
    , address: {
        type: String,
        default: ""
    },
    phoneNumberOder: {
        type: String,
        validate: {
            validator: function (value) {
                // Kiểm tra định dạng số điện thoại
                return /^\d{10}$/.test(value);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.'
        },
        default: " "
    }
}, {
    timestamps: true    // tự động tạo colums ngày inssert vào dataabase 
})
mongoose.plugin(slug);
curtomer.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè sự lấy ht của mongo
    deletedAt: true
});
module.exports = mongoose.model('curtomer', curtomer)


