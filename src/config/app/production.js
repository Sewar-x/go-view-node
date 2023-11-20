/**
 * ===========================================
 * 应用设置
 * ===========================================
 */
const _package = require('@package')
const APP_NAME = _package.name // 项目名称，从项目名称中获取
const APP_ROOT = process.cwd() //获取当前工作目录的路径
module.exports = {
  PORT: process.env.PORT || 9991, //服务端口号
  LOCAL_ADDR: '0.0.0.0', // 本地地址
  APP_ROOT, // 文件根路径
  APP_NAME,
  APP_SECRET: Buffer.from(APP_NAME, 'base64'), // jwt 密钥
  VERSION: _package.version,
}
