
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const bills = new Schema({
    idCustomer: {
        type: Schema.Types.ObjectId,
    },
    idProduct: {
        type: Schema.Types.ObjectId
    },
    totalMoney: {
        type: Number,
    },
    quantityProduct :{
        type:Number
    },
    status:{
        type:String,
        default:"Normal"
    }
}, {
    timestamps: true    // tự động tạo colums ngày inssert vào dataabase 
})
mongoose.plugin(slug);
bills.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè những phương thức của monggo ví dụ như find() không lấy ht nữa mà chỉ lấy delete: flalse
    deletedAt: true
});
module.exports = mongoose.model('bills', bills)