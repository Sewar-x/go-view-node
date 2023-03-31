const static = require('./static.js')
const cors = require('./cors.js')
const bodyParser = require('body-parser')
const { STATIC } = require('../config')

module.exports = app => {
  app.use(cors)
  // parse requests of content-type - application/json
  app.use(bodyParser.json())
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(STATIC, static)
}
