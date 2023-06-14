/**
 * ===========================================
 * 日志配置
 * ===========================================
 */
const path = require('path')
const app = require('./app.js')
const _package = require('@package')
module.exports = {
  LOG_CONFIG: {
    logLevel: 'debug', // 指定记录的日志级别
    dir: path.join(app.APP_ROOT, 'logs'),
    projectName: _package.name, // 项目名，记录在日志中的项目信息
    ip: '' // 默认情况下服务器 ip 地址
  }
}
