/**
 * ================数据库配置============================
 */
const utils = require('../utils/db_utils/sequelize')
const DB = {
  DB_HOST: '127.0.0.1',
  DB_PORT: 3306,
  DB_NAME: 'low-code',
  DB_USER: 'root',
  DB_PWD: 'root',
  DATABASE: 'mysql',
  CHARSET: 'utf8mb4'
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
      timezone: '+08:00',
      define: {
        charset: DB.CHARSET,
        freezeTableName: true, //强制表名称等于模型名称,sequelize就不会在表名后附加“s”字符
        timestamps: true, //加属性created_at和updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: false //开启假删除
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
