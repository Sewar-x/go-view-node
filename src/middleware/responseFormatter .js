/**
 * 封装请求响应方法
 */

module.exports = () => {
  const responseFormatter = (req, res, next) => {
    // 在 res 对象中定义一个 sendResponse 方法
    res.sendResponse = ({ code, msg, data }) => {
      const response = {
        code: code || 200,
        msg: msg,
        data: data
      }
      res.status(code).json(response)
    }
    next()
  }

  const responseErrorFormatter = (req, res, next) => {
    // 在 res 对象中定义一个 sendResponse 方法
    res.sendError = ({ code, msg, data }) => {
      const response = {
        code: code || 500,
        msg: msg,
        data: data
      }
      res.status(404).json(response)
    }
    next()
  }

  return (req, res, next) => {
    responseFormatter(req, res, next)
    responseErrorFormatter(req, res, next)
  }
}
