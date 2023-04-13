/**
 * 封装请求响应方法
 */
const { log } = require('./logger')
const responseFormatter = (req, res, next) => {
  // 在 res 对象中定义一个 sendResponse 方法
  res.sendResponse = ({ code, msg, data, params = {} }) => {
    const status = code || 200
    const response = {
      code: status,
      msg: msg || '操作成功!',
      ...params,
      data: data || {}
    }
    // 记录错误日志
    log && log('info', Object.assign({}, response, res.logInfo))
    res.status(status).json(response)
  }
}

const responseErrorFormatter = (req, res, next) => {
  // 在 res 对象中定义一个 sendResponse 方法
  res.sendError = ({ code, msg, data, params = {} }) => {
    const status = code || 500
    const response = {
      code: status,
      msg: msg || '操作失败!',
      ...params,
      data: data || {}
    }
    // 记录错误日志
    log && log('error', Object.assign({}, response, res.logInfo))
    res.status(status).json(response)
  }
}
module.exports = (req, res, next) => {
  responseFormatter(req, res, next)
  responseErrorFormatter(req, res, next)
  next()
}
