
const homeRouter = require('./home.js')
const adminRouter = require('./adMinroute.js')
const isAdmin = require('../middleware/security/authorization/checkAdmin.js');

function route(app) {
  app.use('/admin', isAdmin,adminRouter)
  app.use('/', homeRouter);

}

module.exports = route;
