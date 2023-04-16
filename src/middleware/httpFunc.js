/**
 * 请求响应参数格式化中间件，注意：在使用 body 参数之前，需要使用 body-parser 中间件来解析请求体
 */
const { codeEnums, codeMsgEnums } = require('@enums/response.js')
const { log } = require('./logger')
/**
 * 获取请求参数
 * @returns
 */
const getReqParams = (req, res, next) => {
  req.getReqParams = () => {
    // 根据请求方法获取参数对象
    let params = {}
    const queryMethods = ['GET', 'DELETE']
    if (queryMethods.indexOf(req.method) > -1) {
      params = req.query
    } else {
      params = req.body
    }
    return params
  }
  next()
}

/**
 * 请求参数校验
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateReqParams = (req, res, next) => {
  req.validateReqParams = (rules = []) => {
    const errors = []
    const reqParams = req.getReqParams()
    // 遍历每个参数，进行校验
    rules.forEach(param => {
      const value = reqParams[param.key]
      if (param.required && !value) {
        errors.push(`参数 '${param.key}' 必填.`)
      }
      if (param.minLength && value && value.length < param.minLength) {
        errors.push(`参数 '${param.key}' 至少 ${param.minLength} 个字符.`)
      }
      // 添加其他自定义校验规则
    })

    return errors
  }
  next()
}

/**
 * 响应参数格式化
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseFormatter = (req, res, next) => {
  // 在 res 对象中定义一个 sendResponse 方法
  res.sendResponse = ({ code, msg = codeMsgEnums[codeEnums.OK], data = {}, params = {} } = {}) => {
    const status = code || codeEnums.OK
    const response = {
      code: status,
      msg,
      data,
      ...params
    }
    // 记录错误日志
    log && log('info', Object.assign({}, response, res.logInfo))
    return res.status(status).json(response)
  }
  next()
}

/**
 * 错误响应格式化
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const responseErrorFormatter = (req, res, next) => {
  // 在 res 对象中定义一个 sendResponse 方法
  res.sendError = ({ code, msg = codeMsgEnums[codeEnums.BadRequest], data = {}, params = {} } = {}) => {
    const status = code || codeEnums.BadRequest
    const response = {
      code: status,
      msg,
      data,
      ...params
    }
    // 记录错误日志
    log && log('error', Object.assign({}, response, res.logInfo))
    return res.status(status).json(response)
  }
  next()
}

module.exports = [getReqParams, validateReqParams, responseFormatter, responseErrorFormatter]
