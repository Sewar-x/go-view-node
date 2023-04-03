/**
 * 封装请求响应方法
 */
const { log } = require('./logger')
module.exports = () => {
  const responseFormatter = (req, res, next) => {
    // 在 res 对象中定义一个 sendResponse 方法
    res.sendResponse = ({ code, msg, data }) => {
      const status = code || 200
      const response = {
        code: status,
        msg: msg,
        data: data
      }
      // 记录错误日志
      log && log('info', Object.assign({}, response, res.logInfo))
      res.status(status).json(response)
    }
    next()
  }

  const responseErrorFormatter = (req, res, next) => {
    // 在 res 对象中定义一个 sendResponse 方法
    res.sendError = ({ code, msg, data }) => {
      const status = code || 500
      const response = {
        code: status,
        msg: msg,
        data: data
      }
      // 记录错误日志
      log && log('error', new Error(Object.assign({}, response, res.logInfo)))
      res.status(status).json(response)
    }
    next()
  }

  return (req, res, next) => {
    responseFormatter(req, res, next)
    responseErrorFormatter(req, res, next)
  }
}
