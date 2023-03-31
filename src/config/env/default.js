'use strict'

const app = require('../app.js')
const database = require('../database.js')
const system = require('../system.js')
const log = require('../log.js')
const token = require('../token.js')
let config = {
  ...app,
  ...system,
  ...log,
  ...token,
  //数据库配置
  database: database.default.db,
  // sequelize 配置
  sequelizeConfig: database.default.sequelize
}

module.exports = config
