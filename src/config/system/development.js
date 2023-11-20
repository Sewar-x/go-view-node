/**
 * ===========================================
 * 系统配置
 * ===========================================
 */
const path = require('path')
const app = require('@config/app/index.js')
module.exports = {
  UPLOAD_PATH: path.join(app.APP_ROOT, 'tmp/upload/'), //文件上传目录
  STATIC: '/static', // 静态资源前缀
  PUBLICPATH: '/public', // 静态资源目录
  OOS_PATH: '/api/goview/project/getImages/', // OSS 上传路径
  OSS_BUCKETNAME: 'getuserphoto',
  OSS_HOST: 'localhost',
  OSS_PORT: 9991,
  CORS_WHITElIST: [`http://localhost:${app.PORT}`, 'http://10.126.16.116:9991/api/goview/', 'http://10.126.16.116:8080'],
  DEBUG: true,
  AXIOS_BASEURL: ''
}
