/**
 * 系统配置
 */
const path = require('path')
const app = require('./app.js')
module.exports = {
  UPLOAD_PATH: path.join(app.APP_ROOT, 'tmp/upload/led/')
}
