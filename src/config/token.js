/**
 * ===========================================
 * token 配置
 * ===========================================
 */
module.exports = {
  sessionExpiresIn: '24h',
  tokenExpMinutes: 120 * 60 * 1000, //JWT有效期(分钟=默认120)
  tokenCookiesKey: 'LowCodeToken', // token cookies key
  tokenStartsWithStr: 'local-code-node ', //token 前缀
  tokenAuthWhiteList: ['/goview/sys/login', '/goview/sys/getOssInfo','/goview/sys/regsiter','/api/goview/project/getImages','/mock'] // token 验证白名单路路由
}
