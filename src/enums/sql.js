/**
 * =============================
 *  SQL 相关枚举类型
 * =============================
 */


const sqlStateEnums = {
    sqlClause: '0',//普通sql 语句
    procNotRet: '1',//无返回值存储过程
    procWithRet: '2',//带返回值存储过程
    procWithSelect: '3',
    sqlClauseMult: '9' //普通 SQL语句--返回多个dataset
}

const sqlTypeEnums = {
    int: 'int',
    float: 'float',
    str: 'str',
}

const sqlEnums = {
    mysql: 'mysql',
    mssql: 'mssql',
    sqlite: 'sqlite',
}


module.exports = {
    sqlEnums,
    sqlStateEnums,
    sqlTypeEnums
}
