/**该
 * 请求参数格式化中间件，注意：在使用 body 参数之前，需要使用 body-parser 中间件来解析请求体
 */

// 定义参数中间件
const paramsMiddleware = (req, res, next) => {
  req.getParams = () => {
    // 根据请求方法获取参数对象
    let params = {}
    if (req.method === 'GET') {
      params = req.query
    } else {
      params = req.body
    }
    return params
  }
  next()
}

module.exports = paramsMiddleware
