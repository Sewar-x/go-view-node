'use strict'

const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')

const { sequelizeConfig } = require('../config')

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig.connect, {
  logging: console.log,
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
})

let db = {}
const dbType = sequelize.options.dialect
const dbName = sequelize.config.database || sequelizeConfig.database

db.Led_Projects = require('./self/Led_Projects.js')(sequelize, DataTypes)
db.Led_Projectdatas = require('./self/Led_Projectdatas.js')(sequelize, DataTypes)
db.pf_user = require('./self/pf_user.js')(sequelize, DataTypes)

// 同步表结构
sequelize.sync()

global.db = db

module.exports = {
  sequelize,
  dbType,
  dbName,
  db
}
