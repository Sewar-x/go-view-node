require('./plugins/alias.js') //定义路径别名,注意放在文件最顶部最先执行
const express = require('express')
const app = express()
const models = require('./models')
const routes = require('./routers')
const middleware = require('./middleware')
const pathParse = require('./plugins/pathParse.js')
const ip = require('ip')
function bootstrap() {
  //将 Controllers 文件路径转为对象
  pathParse(app)
  models(app)
  middleware(app)
  routes(app) //注意：路由必须首先注册
}

bootstrap()
const { PORT } = require('./config')
// set port, listen for requests
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
      ===================================================================
        🛡️  Server listening on: http://${ip.address()}:${PORT} 🛡️
      ===================================================================
    `)
})
