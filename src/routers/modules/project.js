'use strict'

var multer = require('multer')
var upload = multer()

module.exports = (app, router) => {
  // 获取项目列表
  router.get('/goview/project/list', app.controllers.project.project_list)
  // 根据项目 id 查询项目数据
  router.get('/goview/project/getData', app.controllers.project.project_by_id)
  // 创建项目
  router.post('/goview/project/create', app.controllers.project.project_create)
  // 编辑项目 
  router.post('/goview/project/edit', app.controllers.project.project_edit)
  // 删除项目
  router.delete('/goview/project/delete', app.controllers.project.project_delete)
  // 修改发布状态
  router.put('/goview/project/publish', app.controllers.project.project_publish)
  // 保存项目数据:在此特别注意，由于goview前端采用的是 Content-Type: multipart/form-data; 所在在此必须要使用multer的中间件，否则，无法从req.body中获取到相关的数据
  router.post('/goview/project/save/data', upload.array(), app.controllers.project.project_data_save)
  // 项目截图上传
  router.post('/goview/project/upload', app.controllers.project.project_upload)
  // 获取图片
  router.get('/goview/project/getImages/:id', app.controllers.project.project_get_images)
  return router
}
