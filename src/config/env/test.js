'use strict'

const utils = require('./utils')

const DB_HOST = '192.168.31.112'
const DB_PORT = 1433
const DB_NAME = 'Ls'
const DB_USER = 'sa'
const DB_PWD = 'mes'

const config = {
  sequelizeConfig: {
    username: DB_USER, //本地
    password: DB_PWD,
    database: DB_NAME,
    connect: {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: false,
          trustServerCertificate: true
        },
        // useUTC: true,
        multipleStatements: true,
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true //默认DECIMAL and NEWDECIMAL 返回 String
      },
      timezone: '+08:00',
      define: {
        freezeTableName: true, //sequelize就不会在表名后附加“s”字符
        timestamps: false, //加属性created_at和updated_at
        createdAt: 'created_at',
        // 将updated_at对应到数据库的updated_at字段
        updatedAt: 'updated_at',
        // 是否为表添加 deletedAt 字段
        // 在日常开发中删除数据记录是一大禁忌，因此我们删除数据并不会真正删除，而是为他添加deletedAt字段
        paranoid: false, //开启假删除
        // raw: true // 设置为 true，即可返回源数据
        // 定义全局的钩子
        hooks: {
          // beforeCreate: () => {
          //   // 做些什么
          // },
          afterFind: async (result, options, fn) => {
            let res = await utils.fmtFun(result)
            return res
          }
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
