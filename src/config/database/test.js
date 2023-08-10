'use strict'
// 是否开启结果集格式化
const FMT_ROWS_DATE = false
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

const sequelizeConfig = {
    username: DB.DB_USER,
    password: DB.DB_PWD,
    database: DB.DB_NAME,
    connect: {
        host: DB.DB_HOST,
        port: DB.DB_PORT,
        dialect: DB.DATABASE, //数据库类型
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true
            },
            dateStrings: true,
            typeCast: true,
            multipleStatements: true,//是否允许在单个查询中执行多个语句，用于MySQL。默认为false。
            charset: DB.CHARSET,// 连接字符集，用于MySQL。默认为utf8mb4
            supportBigNumbers: true, // 是否支持大数字，用于MySQL。默认为true。
            bigNumberStrings: true,//是否将大数字作为字符串返回，用于MySQL。默认为false。
            decimalNumbers: true
        },
        timezone: DB.TIMEZONE,
        define: {
            charset: DB.CHARSET,
            freezeTableName: true, //强制表名称等于模型名称,sequelize就不会在表名后附加“s”字符
            timestamps: true, //加属性created_at和updated_at
            createdAt: 'created_at', //将包含代表创建时刻的时间戳,
            updatedAt: 'updated_at', //将包含最新更新的时间戳
            paranoid: false //开启假删除,注意 Paranoid 需要时间戳才能起作用(即,如果你传递 timestamps: false 了,paranoid 将不起作用).
        },
        // 定义全局的钩子
        hooks: {
            afterFind: async (result, options, fn) => {
                if (FMT_ROWS_DATE) {
                    return await utils.fmtFun(result)
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

module.exports = {
    database: DB,
    sequelizeConfig
}
