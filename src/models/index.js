'use strict'

const DB = require('@utils/db_utils/db')
const { sequelizeConfig, database, knexConfig, DEBUG } = require('@config')
const dbInstance = new DB({
  sequelizeConfig,
  database,
  knexConfig,
  logging: DEBUG ? 'console' : false,
  DEBUG
})

// 加载model文件
dbInstance.loadModel()
//一次同步所有模型
dbInstance.sync()

let { sequelize, dbType, dbName, models, tabs } = dbInstance

let dbHelper = require('@utils/db_utils/dbHelper')(sequelize)

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
