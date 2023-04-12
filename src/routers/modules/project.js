'use strict'

var multer = require('multer')
var upload = multer()

module.exports = (app, router) => {
  router.get('/goview/project/list', app.controllers.project.project_list)
  router.get('/goview/project/getData', app.controllers.project.project_by_id)
  router.post('/goview/project/create', app.controllers.project.project_create)
  router.post('/goview/project/edit', app.controllers.project.project_edit)
  router.delete('/goview/project/delete', app.controllers.project.project_delete)
  router.put('/goview/project/publish', app.controllers.project.project_publish)
  // 在此特别注意，由于goview前端采用的是 Content-Type: multipart/form-data; 所在在此必须要使用multer的中间件，否则，无法从req.body中获取到相关的数据
  router.post('/goview/project/save/data', upload.array(), app.controllers.project.project_data_save)
  // 以下方法不可用
  // router.post('/goview/project/save/data', require('body-parser').urlencoded({ extended: true }), app.controllers.project.project_data_save)
  router.post('/goview/project/upload', app.controllers.project.project_upload)
  router.get('/goview/project/getImages/:id', app.controllers.project.project_get_images)
  return router
}
