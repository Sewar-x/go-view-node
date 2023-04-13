'use strict'

const _ = require('lodash')

const defaults = require('./env/default')
const dev = require('./env/dev')
const test = require('./env/test')
const prod = require('./env/prod')

const APP_CONFIG = {
  dev: _.defaults(dev || {}, defaults),
  test: _.defaults(test || {}, defaults),
  prod: _.defaults(prod || {}, defaults)
}[process.env.NODE_ENV || 'dev']

global.config = APP_CONFIG

module.exports = APP_CONFIG
