'use strict'

const fs = require('fs')

const { sequelizeConfig, database, knexConfig, DEBUG } = require('@config')
const dbUtil = require('@utils/db_utils/db')({
  sequelizeConfig,
  database,
  knexConfig,
  logging: DEBUG ? 'console' : false,
  DEBUG
})
let all_model_list = [__dirname + '/self', __dirname + '/pf']

// 加载model文件
dbUtil.loadModelList(all_model_list)

dbUtil.modelAssociate()

let { sequelize, dbType, dbName, knex, models, tabs } = dbUtil

let dbHelper = require('@utils/db_utils/dbHelper')(sequelize)

dbUtil.sync()

dbUtil.dbHelper = dbHelper

// plg_common 和 smt_xx 都用db作为数据加载的依据

let db = {
  sequelize,
  dbType,
  dbName,
  ...models,
  tabs,
  dbHelper,
  knex
}

global.db = db

module.exports = app => {
  sequelize, dbType, dbName
}
