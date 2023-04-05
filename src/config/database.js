/**
 * ================数据库配置============================
 */
const utils = require('@utils/db_utils/sequelize')
const { DEBUG } = require('./system')
const DB = {
  DB_HOST: '127.0.0.1',
  DB_PORT: 3306,
  DB_NAME: 'low-code',
  DB_USER: 'root',
  DB_PWD: 'root',
  DATABASE: 'mysql',
  KNEX_CLIENT: 'mysql2',
  CHARSET: 'utf8mb4',
  TIMEZONE: '+08:00'
}

// 是否开启结果集格式化
const FMT_ROWS_DATE = false
module.exports = {
  database: DB,
  sequelizeConfig: {
    username: DB.DB_USER,
    password: DB.DB_PWD,
    database: DB.DB_NAME,
    connect: {
      host: DB.DB_HOST,
      port: DB.DB_PORT,
      dialect: DB.DATABASE,
      dialectOptions: {
        options: {
          encrypt: false,
          trustServerCertificate: true
        },
        dateStrings: true,
        typeCast: true,
        multipleStatements: true,
        charset: DB.CHARSET,
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
      },
      timezone: DB.TIMEZONE,
      define: {
        charset: DB.CHARSET,
        freezeTableName: true, //强制表名称等于模型名称,sequelize就不会在表名后附加“s”字符
        timestamps: true, //加属性created_at和updated_at
        createdAt: 'created_at', //将包含代表创建时刻的时间戳,
        updatedAt: 'updated_at', //将包含最新更新的时间戳
        paranoid: false //开启假删除
      },
      // 定义全局的钩子
      hooks: {
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
  },
  knexConfig: {
    client: 'mysql2',
    connection: {
      host: DB.DB_HOST,
      port: DB.DB_PORT,
      user: DB.DB_NAME,
      password: DB.DB_PWD,
      database: DB.DATABASE,
      timezone: DB.TIMEZONE,
      // 方法一
      dateStrings: true,
      useNullAsDefault: true
    },
    debug: DEBUG,
    log: {
      debug(msg) {
        if (msg?.sql) return false
          let {  bindings } = msg
          if (bindings) {
            if (bindings.length == 0) logger.info(`【knex ${DB.KNEX_CLIENT}】` + sql)
            else logger.info(`【knex ${DB.KNEX_CLIENT}】` + sql, `[ ${bindings.join(', ')} ]`)
          } else {
            logger.info(`【knex ${DB.KNEX_CLIENT}】` + sql)
          }
        
      }
    }
  }
}
