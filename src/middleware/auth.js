/**
 * 校验客户端请求token中间件,处理检查请求头部token是否正确
 * 文档：https://www.npmjs.com/package/jsonwebtoken
 * 参考资料：https://segmentfault.com/a/1190000015255975
 */

const { TOKEN } = require('@config')
const tokenKit = require('@plugins/token')
const { codeEnums, codeMsgEnums, tokenCodeMsgEnums, tokenCodeEnums } = require('@enums/response.js')

/**
 * 以下是一些常见的标准的 token 错误码：
 * 401 Unauthorized：没有提供 token 或者提供的 token 无效。
 * 403 Forbidden：提供的 token 是有效的，但用户没有足够的权限访问所请求的资源。
 * 419 Authentication Timeout（或 440 Login Timeout）：token 已过期或超时。\
 * 498 Invalid Token：提供的 token 无效。
 * 499 Token Required：没有提供 token。
 * 500 Internal Server Error：服务器在尝试验证 token 时遇到了内部错误。
 */

/**
 * token 验证中间件
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const tokenAuth = async (req, res, next) => {
  if (!TOKEN.tokenAuthWhiteList.some(v => req.path.indexOf(v) >= 0)) {
    //判断当前访问路径是否存在于白名单,不存在白名单内进行验证
    const token = req.headers.authorization
    if (!token) {
      return res.sendError({
        code: tokenCodeEnums.InvalidToken,
        msg: tokenCodeMsgEnums[tokenCodeEnums.InvalidToken]
      })
    }

    try {
      const decoded = await tokenKit().verifyToken(token)
      console.log('解析的用户信息===', req.path, decoded)
      if (decoded.code === codeEnums.OK) {
        // 将用户信息存储到请求对象中
        console.log('鉴权成功')
        req.user = decoded.data
        next()
      } else {
        return res.sendError({
          code: tokenCodeEnums.InvalidToken,
          data: decoded.data
        })
      }
    } catch (e) {
      return res.sendError({
        code: tokenCodeEnums.InvalidToken,
        msg: tokenCodeMsgEnums[tokenCodeEnums.InvalidToken],
        data: e
      })
    }
  } else {
    // 白名单域名
    console.log('====白名单域名:', req.path)
    next()
  }
}
module.exports = tokenAuth
