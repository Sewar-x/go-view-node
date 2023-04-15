'use strict'

const DB = require('@plugins/db/db')
const { DATABASE, SYSTEM } = require('@config')
const dbInstance = new DB({
  sequelizeConfig: DATABASE.sequelizeConfig,
  database: DATABASE.database,
  logging: SYSTEM.DEBUG ? 'console' : false,
  DEBUG: SYSTEM.DEBUG
})

// 加载model文件
dbInstance.loadModel()
//一次同步所有模型
dbInstance.sync()

let { sequelize, dbType, dbName, models, tabs } = dbInstance

let dbHelper = require('@plugins/db/dbHelper')(sequelize)

dbInstance.dbHelper = dbHelper

// plg_common 和 smt_xx 都用db作为数据加载的依据

let db = {
  sequelize,
  dbType,
  dbName,
  ...models,
  tabs,
  dbHelper
}

global.db = db

module.exports = app => {
  sequelize, dbType, dbName, tabs, dbHelper
}
