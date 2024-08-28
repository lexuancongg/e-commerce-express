
const userRouters = require('./user.js')
const productRouter = require('./products.js')
const billRouter = require('./oder.js')
const homeRouter = require('./home.js')
const cartRouter = require('./cart.js')
const customerRouter = require('./customer.js')
const chatRouter = require('./chat.js')
const categoryRouter = require('./category.js')
const feetbackRouter= require('./feetback.js')

module.exports = app => {
  app.use('/', userRouters);
  productRouter(app)
  billRouter(app)
  homeRouter(app)
  cartRouter(app)
  customerRouter(app)
  chatRouter(app)
  categoryRouter(app)
  feetbackRouter(app)

}
