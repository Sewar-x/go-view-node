'use strict'

module.exports = (app, router) => {
  router.post('/goview/sys/login', app.controllers.login.login)
  router.get('/goview/sys/Logout', app.controllers.login.logout)
  return router
}
