'use strict'

const express = require('express')
const router = express.Router()

router.use('/api', require('./led/led'))
router.use('/api', require('./pf/api'))
router.use('/', require('./public'))

module.exports = router
