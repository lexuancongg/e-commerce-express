const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')
var mongooseDelete = require('mongoose-delete');
const bill = require('./oder');

const product = new Schema({
  // các trường dữ liệu mà sau này có thể có , nếu inser vào database thì trg đó phải có trong này nếu k sẽ k inser đc 
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  caterogy: {
    type: String
  },
  quantity: {
    type: Number
  },
  nameCategory: {
    type: String,
  }

}, {
  timestamps: true    // tự động tạo colums ngày inssert vào dataabase 
});
mongoose.plugin(slug);
product.plugin(mongooseDelete, {
  overrideMethods: 'all',   // overright gì đè sự lấy ht của mongo
  deletedAt: true
});

const Product = mongoose.model('product', product)
Product.collection.createIndex({ name: 'text' })
  .then(() => console.log('Index created successfully'))
  .catch(error => console.error('Error creating index:', error));
module.exports = Product


