const express = require('express')
const app = express()
const models = require('./models')
const routes = require('./routers')
const middleware = require('./middleware')
const pathParse = require('./plugins/pathParse.js')

function bootstrap() {
  //将 Controllers 文件路径转为对象
  pathParse(app)
  models(app)
  middleware(app)
  routes(app)
}

bootstrap()
const { PORT } = require('./config')
// set port, listen for requests
app.listen(PORT, () => {
  console.log(`
      ==========================================
        🛡️  Server listening on port: ${PORT} 🛡️
      ==========================================
    `)
})
