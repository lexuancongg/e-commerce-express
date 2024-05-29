const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                // Kiểm tra định dạng số điện thoại
                return /^\d{10}$/.test(value);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.'
        }
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                // Kiểm tra định dạng email
                return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(Email);
            },
            message: 'Email không hợp lệ. Vui lòng nhập đúng định dạng.'
        }
    },
    passWord: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'user'
    },
    avatar: {
        type: String,
        default: ""
    },
    name:{
        type: String,
    }
}, {
    // tự động tạo hai trường createdAt và updatedAt
    timestamps: true
})
module.exports = mongoose.model('user', user);

