/**
 * 系统配置
 */
const path = require('path')
const app = require('./app.js')
module.exports = {
  UPLOAD_PATH: path.join(app.APP_ROOT, 'tmp/upload/led/'), //文件上传目录
  STATIC: '/static', // 静态资源前缀
  PUBLICPATH:  '/public', // 静态资源目录
  DEBUG: true
}
