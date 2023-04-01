const static = require('./static.js')
const cors = require('./cors.js')
const errorHandlers = require('./error.js')
const ip = require('./ip.js')
const bodyParser = require('body-parser')
const { STATIC } = require('../config')

//notice: 中间件装入顺序很重要：首先装入的中间件函数也首先被执行。
module.exports = app => {
  // 跨域中间件
  app.use(cors)
  // parse requests of content-type - application/json
  app.use(bodyParser.json())
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))
  // 静态资源中间件
  app.use(STATIC, static)
  app.use(ip)
  //Express 中间件是按顺序执行的。您应该在所有其他中间件之后，最后定义错误处理程序。否则，您的错误处理程序将不会被调用
  app.use(errorHandlers)
}