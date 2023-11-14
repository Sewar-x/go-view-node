const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const static = require('./static.js')
const cors = require('./cors.js')
const errorHandlers = require('./error.js')
const authHandlers = require('./auth.js')
const axiosPlugin = require('./axios.js')
const httpFunc = require('./httpFunc.js')
const { loggerMiddleware } = require('./logger.js')
const { SYSTEM } = require('@config/index.js')

//notice: 中间件装入顺序很重要：首先装入的中间件函数也首先被执行。
module.exports = app => {
  // 跨域中间件
  app.use(cors)
  // 解析 application/json 格式的请求体
  app.use(bodyParser.json())
  // 解析 application/x-www-form-urlencoded 格式的请求体
  app.use(bodyParser.urlencoded({ extended: true }))
  // 静态资源中间件
  app.use(SYSTEM.STATIC, static)
  // 解析 HTTP 请求中的 cookie，使得服务器可以方便地访问和处理 cookie 数据
  app.use(cookieParser())
  //  请求响应参数格式化中间件，在 req 请求对象中挂载请求相关方法 
  app.use(httpFunc)
  // axios 中间件
  app.use(axiosPlugin)
  // 日志管理模块
  app.use(loggerMiddleware)
  // 校验客户端请求token中间件,处理检查请求头部token是否正确
  app.use(authHandlers)
  //Express 中间件是按顺序执行的。您应该在所有其他中间件之后，最后定义错误处理程序。否则，您的错误处理程序将不会被调用
  app.use(errorHandlers)
}
