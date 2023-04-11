/**
 * token 配置
 */
module.exports = {
  sessionExpiresIn: '24h',
  tokenExpMinutes: 120 * 60 * 1000, //JWT有效期(分钟=默认120)
  startsWithStr:'local-code-node '
}
