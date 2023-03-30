'use strict'

const path = require('path')
const utils = require('./utils')
const _package = require('../../../package.json')

const APP_ROOT = process.cwd()

const DB_HOST = '127.0.0.1'
const DB_PORT = 3306
const DB_NAME = 'led'
const DB_USER = 'root'
const DB_PWD = 'mes'
const APP_NAME = 'LED'
// 是否开启结果集格式化
const FMT_ROWS_DATE = false

let config = {
  APP_ROOT: APP_ROOT,
  APP_NAME: APP_NAME,
  APP_PORT: 4444,
  APP_SECRET: Buffer.from(APP_NAME, 'base64'),
  DEBUG: true,
  VERSION: _package.version,
  LOG_DIR: path.join(APP_ROOT, 'logs'),
  UPLOAD_PATH_LED: path.join(APP_ROOT, 'tmp/upload/led/'),
  expiresIn: '240h',
  SALT_WORK_FACTOR: 10,
  // api 返回前端的格式类型
  API_RES_TYPE: 'datagrid',

  sequelizeConfig: {
    username: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    connect: {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
        multipleStatements: true,
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
      },
      timezone: '+08:00',
      define: {
        charset: 'utf8mb4',
        freezeTableName: true, //sequelize就不会在表名后附加“s”字符
        timestamps: true, //加属性created_at和updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      },
      // 定义全局的钩子
      hooks: {
        // beforeCreate: () => {
        //   // 做些什么
        // },
        afterFind: async (result, options, fn) => {
          if (FMT_ROWS_DATE) {
            let res = await utils.fmtFun(result)
            return res
          } else return result
        }
      },
      pool: {
        max: 5, // 连接池最大链接数量
        min: 0, // 最小连接数量
        acquire: 30000, //建立连接最长时间
        idle: 10000 //空闲最长连接时间
      }
    }
  }
}

module.exports = config
