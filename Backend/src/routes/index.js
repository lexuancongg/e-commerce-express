
const homeRouter = require('./home.js')
const adminRouter = require('./adMinroute.js')
const isAdmin = require('../security/authorization/passport-jwt.js');

function route(app) {
  app.use('/admin', isAdmin,adminRouter)
  app.use('/', homeRouter);

}

module.exports = route;
