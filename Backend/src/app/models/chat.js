const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const message = require('./message');
const chat = new Schema({
    chats: {
        type: [message.schema]
    },
    lastMessage: {
        type: message.schema
    },
}, {
    timestamps: true
})
mongoose.plugin(slug);
chat.plugin(mongooseDelete, {
    overrideMethods: 'all',   // overright gì đè những phương thức của monggo ví dụ như find() không lấy ht nữa mà chỉ lấy delete: flalse
    deletedAt: true
});
module.exports = mongoose.model('chat', chat)