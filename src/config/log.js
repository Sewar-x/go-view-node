/**
 * 日志配置
 */
const path = require('path')
const app = require('./app.js')
module.exports = {
  LOG_DIR: path.join(app.APP_ROOT, 'logs')
}
