'use strict'

module.exports = (app, router) => {
  // 根据id获取 api 接口
  router.use('/getDataByApiId', app.controllers.api.getDataByApiId)
  // 新增修改
  router.use('/api_update', app.controllers.api.api_update)
  router.use('/api_del', app.controllers.api.api_del)
  router.use('/api_test', app.controllers.api.api_test)
  return router
}
