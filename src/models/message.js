const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const message = new Schema({
    content: {
        type: String
    },
    status: {
        type: String,
        default: 'dontSee'
    }
}, {
    timestamps: true
})
mongoose.plugin(slug);
message.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè những phương thức của monggo ví dụ như find() không lấy ht nữa mà chỉ lấy delete: flalse
    deletedAt: true
});
module.exports = mongoose.model('message', message)