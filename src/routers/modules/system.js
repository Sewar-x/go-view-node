'use strict'

module.exports = (app, router) => {
  router.get('/goview/sys/getOssInfo', app.controllers.system.getOssInfo)
  return router
}
