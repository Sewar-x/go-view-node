'use strict'

var multer = require('multer')
var upload = multer()

module.exports = (app, router) => {
  router.get('/goview/sys/getOssInfo', app.controllers.led.getOssInfo)
  router.get('/goview/project/list', app.controllers.led.project_list)
  router.get('/goview/project/getData', app.controllers.led.project_by_id)
  router.post('/goview/project/create', app.controllers.led.project_create)
  router.post('/goview/project/edit', app.controllers.led.project_edit)
  router.delete('/goview/project/delete', app.controllers.led.project_delete)
  router.put('/goview/project/publish', app.controllers.led.project_publish)
  // 在此特别注意，由于goview前端采用的是 Content-Type: multipart/form-data; 所在在此必须要使用multer的中间件，否则，无法从req.body中获取到相关的数据
  router.post('/goview/project/save/data', upload.array(), app.controllers.led.project_data_save)
  // 以下方法不可用
  // router.post('/goview/project/save/data', require('body-parser').urlencoded({ extended: true }), app.controllers.led.project_data_save)
  router.post('/goview/project/upload', app.controllers.led.project_upload)
  router.get('/goview/project/getImages/:id', app.controllers.led.project_get_images)
  return router
}
