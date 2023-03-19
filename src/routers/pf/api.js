'use strict'

const { Router } = require('express')
const router = Router()
const api = require('../../controllers/api')

router.use('/getDataByApiId', api.getDataByApiId)
router.use('/api_update', api.api_update)
router.use('/api_del', api.api_del)
router.use('/api_test', api.api_test)

module.exports = router
