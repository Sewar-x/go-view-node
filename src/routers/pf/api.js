'use strict'

const { Router } = require('express')
const router = Router()

module.exports = app => {
  router.use('/getDataByApiId', app.controllers.api.getDataByApiId)
  router.use('/api_update', app.controllers.api.api_update)
  router.use('/api_del', app.controllers.api.api_del)
  router.use('/api_test', app.controllers.api.api_test)
  return router
}
