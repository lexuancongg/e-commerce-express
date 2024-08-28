const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ReactNativeDemo',{ useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Đã kết nối tới MongoDB');
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { connect };


  
