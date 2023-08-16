/**
 * ===========================================
 * 应用设置
 * ===========================================
 */
 const _package = require('@package')
 const APP_NAME = _package.name
 const APP_ROOT = process.cwd()
 module.exports = {
   PORT: process.env.PORT || 9991,
   LOCAL_ADDR: '0.0.0.0',
   APP_ROOT,
   APP_NAME,
   APP_SECRET: Buffer.from(APP_NAME, 'base64'),
   VERSION: _package.version,
 }
 