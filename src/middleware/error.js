
/**
 * ==================================================
 *  错误处理中间件
 * ==================================================
 */


const { codeEnums } = require('@enums/response.js')

/**
 * 通用 logErrors
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function logErrors(err, req, res, next) {
  console.error(err.stack)
  next(err)
}

/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(codeEnums.BadRequest).send({ error: err })
  } else {
    next(err)
  }
}

/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    // 检查 res.headersSent 属性以确保响应头还没有发送
    return next(err)
  }
  res.status(codeEnums.BadRequest)
  res.render('error', { error: err })
}

module.exports = [logErrors, clientErrorHandler, errorHandler]
