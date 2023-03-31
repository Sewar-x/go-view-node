'use strict'

module.exports = app => {
  const express = require('express')
  const router = express.Router()
  app.use(router)
  router.use('/api', require('./led/led'))
  router.use('/api', require('./pf/api'))
  router.use('/', require('./public'))
}
