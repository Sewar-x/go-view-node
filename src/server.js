
const express = require('express')
const app = express()
const models = require('./models')
const routes = require('./routers')
const middleware = require('./middleware')
models(app)
middleware(app)
routes(app)


const { PORT } = require('./config')
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to low-code-node application.' })
})
// set port, listen for requests
app.listen(PORT, () => {
  console.log(`
      ==========================================
        🛡️  Server listening on port: ${PORT} 🛡️
      ==========================================
    `)
})
