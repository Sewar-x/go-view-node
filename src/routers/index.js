'use strict'
const { PERFIX } = require('../config')
const ledRoute = require('./led/led')
const apiRoute = require('./pf/api')
const publicRoute = require('./pf/api')
module.exports = app => {
  const express = require('express')
  const router = express.Router() //路由器层中间件
  router.use(PERFIX, ledRoute(app))
  router.use(PERFIX, apiRoute(app))
  router.use('/', publicRoute)
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to low-code-node application.' })
  })
  app.use(router)
}
