'use strict'

const { join, resolve } = require('path')

const APP_ROOT = process.cwd()

module.exports = {
  APP_ROOT,
  UPLOAD_PATH_LED: join(APP_ROOT, 'tmp/upload/led/'),
  APP_SECRET: 'led',
  DEBUG: true,
  sessionExpiresIn: '7d',
  sequelizeConfig: {
    username: 'root',
    password: 'mes',
    database: 'led',
    connect: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
      },
      timezone: '+08:00',
      define: {
        charset: 'utf8mb4',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: false, //开启假删除
        // 定义全局的钩子
        hooks: {}
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
