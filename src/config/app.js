/**
 * 应用设置
 */
const _package = require('../../package.json')
const APP_NAME =  _package.name
const APP_ROOT = process.cwd()
module.exports = {
  APP_ROOT,
  APP_NAME,
  APP_SECRET: Buffer.from(APP_NAME, 'base64'),
  VERSION: _package.version,
}
