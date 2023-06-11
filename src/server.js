
/**
 * ==================================================
 *  http 服务入口
 * ==================================================
 */

require('./plugins/alias.js') //定义路径别名,注意放在文件最顶部最先执行
const express = require('express')
const app = express()
const models = require('./models')
const routes = require('./routers')
const middleware = require('./middleware')
const pathParse = require('./plugins/pathParse.js')
const ip = require('ip')
const { APP } = require('./config')

/**
 * 项目启动项
 */
function bootstrap() {
  // 将文件路径转为对象挂载到 app 上，便于获取文件上下文
  pathParse(app)
  // 挂载数据库模型
  models(app)
  // 挂载中间件
  middleware(app)
  // 挂载路由，注意：路由必须首先注册
  routes(app) 
}

bootstrap()
// set port, listen for requests
app.listen(APP.PORT, APP.LOCAL_ADDR, () => {
  console.log(`
      ===================================================================
        🛡️  Server listening on: http://${ip.address()}:${APP.PORT} 🛡️
      ===================================================================
    `)
})
