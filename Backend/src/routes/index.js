
const routeUser = require('./routeUser.js')
const adminRouter = require('./adMinroute.js')
const isAdmin = require('../middleware/security/authorization/checkAdmin.js');

function route(app) {
  app.use('/admin', isAdmin,adminRouter)
  app.use('/', routeUser);

}

module.exports = route;
