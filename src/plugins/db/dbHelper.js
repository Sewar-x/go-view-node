'use strict'

const { sqlStateEnums, sqlTypeEnums, sqlEnums } = require('@enums/sql')



class DbHelper {
  constructor(sequelize) {
    this.sequelize = sequelize
    this.dbType = sequelize?.options?.dialect //数据库类型
    this.QueryTypes = sequelize.QueryTypes //查询类型
  }

  /**
   * 执行 sql 查询
   * @param {*} sql 
   * @returns 
   */
  async exec(sql) {
    return await this.sequelize.query(sql)
  }

  /**
   * 格式化 SQL 查询参数
   * @param {*} sql 
   * @param {*} params 
   * @returns 
   */
  async reaplceSqlParam(sql, params) {
    let _old, _new, _sql
    _sql = sql
    let arr = Object.keys(params)
    for (let k of arr) {
      _new = params[k]
      _old = '@' + k + '@'
      _sql = _sql.replace(new RegExp(_old, 'gm'), _new)
    }
    return _sql
  }


  /**
   * spc查询类型
   * dg按照datagrid的方式构建page_data
   * @param {*} sql sql 语句
   * @param {*} params sql 查询参数
   * @param {*} spc 脚本类型（0: 普通sql; 1: 无返回值存储过程  ???; 2:带返回值存储过程  ???; 3:执行存储过程返回多个SELECT  ???; ）
   * @param {*} dg 是否需要分页（0: 无需分页；）
   * @returns 
   */
  async sqlQuery(sql, params, spc, dg) {
    spc = spc || sqlStateEnums.sqlClause
    dg = dg || '0'
    //格式化 sql 语句
    sql = formatSql(sql, params)
    if (spc == sqlStateEnums.sqlClause) {
      //普通 SQL语句
      return await this.query(sql)
    } else if (spc == sqlStateEnums.sqlClauseMult) {
      //普通 SQL语句--返回多个dataset
      return await this.query(sql, true)
    }
    return await this.procQuery(sql, spc, dg) //存储过程
  }


  /**
   * sql 查询语句封装，兼容多种数据库
   * @param {*} sql 
   * @param {*} multi 
   * @returns 
   */
  async query(sql, multi = false) {
    let res = []
    if (!sql) return res
    if (multi) {
      if (this.dbType == sqlEnums.mysql) {
        res = await this.sequelize.query(sql, { multipleStatements: true, type: this.QueryTypes.SELECT }).then(splitResult)
      }
      else if (this.dbType == sqlEnums.mssql) {
        var sql_list = sql.split(';')
        let id = 0
        let _list = []
        for (let i = 0; i < sql_list.length; i++) {
          let _sql = sql_list[i]
          if (_sql && _sql.length > 0) {
            let tmp = await this.sequelize.query(_sql, { type: this.QueryTypes.SELECT })
            _list.push({ id: id, data: tmp })
            id++
          }
        }
        res = _list
      }
    } else {
      res = await this.sequelize.query(sql, { type: this.QueryTypes.SELECT })
    }
    return res || []
  }

  /**
   * 存储过程封装
   * @param {*} sql 要执行的存储过程的 SQL 语句
   * @param {*} spc 存储过程的类型
   * @param {*} dg 是否需要分页(0：不需要分页)
   * @returns 
   */
  async procQuery(sql, spc, dg) {
    dg = dg || 0
    let res, total = -1
    res = await this.doProc(sql, spc)
    if (dg == 0) {
      return res
    }
    if (this.dbType == sqlEnums.mssql) {
      let tmp = res[res.length - 1] //最后一行
      // 分页总行数
      if (tmp && tmp.hasOwnProperty('count')) {
        return {
          total: tmp.count,
          rows: res.slice(0, res.length - 1)
        }
      } else {
        return {
          total: res.length,
          rows: res
        }
      }
    }
    if (this.dbType == sqlEnums.mysql) {
      if (spc == sqlStateEnums.procNotRet) {
        return {
          total: res.length,
          rows: res
        }
      }
      if (spc == sqlStateEnums.procWithRet) {
        let tmp = res[res.length - 1]
        for (let t in tmp) {
          let objTmp = tmp[t] // 分页总行数
          if (objTmp && objTmp.hasOwnProperty('@count')) {
            total = objTmp['@count']
          }
        }
        let resRows = [],
          tmpRows = res.slice(0, res.length - 2)
        for (let tr in tmpRows[0]) {
          resRows.push(tmpRows[t][tr])
        }
        return {
          total: total,
          rows: resRows
        }
      }
    }
    if (spc == sqlStateEnums.procWithSelect) {
      let tmp = res[res.length - 2]
      for (let t in tmp) {
        let objTmp = tmp[t] // 分页总行数
        if (objTmp && objTmp.hasOwnProperty('O_count')) {
          total = objTmp['O_count']
        }
      }
      let resRows = [],
        tmpRows = res.slice(0, res.length - 2)
      for (let tr in tmpRows[0]) {
        resRows.push(tmpRows[t][tr])
      }
      return {
        total: total,
        rows: resRows
      }
    }
  }


  /**
   * 存储过程查询
   * @param {*} sql 要执行的存储过程的 SQL 语句
   * @param {*} spc 存储过程的类型
   * @returns 
   */
  async doProc(sql, spc) {
    if (this.dbType == sqlEnums.mssql) {
      //只允许取存储过程返回的 dataset 中的第一个 datatable
      if (spc == sqlStateEnums.procNotRet || spc == sqlStateEnums.procWithSelect) {
        sql = await this.procPrefix(sql)
      }
      return await this.sequelize.query(sql, {
        type: this.QueryTypes.SELECT
      })
    } else if (this.dbType == sqlEnums.mysql) {
      if (spc == sqlStateEnums.procNotRet || spc == sqlStateEnums.procWithSelect) {
        sql = await this.procPrefix(sql)
      }
      if (spc == sqlStateEnums.procNotRet) {
        return await this.sequelize.query(sql)
      }
      if (spc == sqlStateEnums.procWithRet || spc == sqlStateEnums.procWithSelect) {
        return await this.sequelize.query(sql, {
          // raw: true,
          // type: this.QueryTypes.SELECT
        })
      }
    } else {
      return await this.sequelize.query(sql)
    }
  }

  /**
 * 前缀处理
 * @param {*} sql 
 * @returns 
 */
  async procPrefix(sql) {
    const prefixMap = {
      [sqlEnums.mysql]: 'call ',
      [sqlEnums.mssql]: 'exec ',
      [sqlEnums.sqlite]: 'call '
    }
    const defaultPrefix = 'call '
    let prefix = prefixMap[this.dbType] || defaultPrefix
    sql = prefix + ' ' + sql
    return sql
  }

  /**
   * 取返回结果集的首行，指定某列的值
   * @param {*} sql 
   * @param {*} column 
   * @param {*} column_type 
   * @returns 
   */
  async queryScalar(sql, column, column_type = sqlTypeEnums.int) {
    let tmp = []
    // 必须使用 type: this.QueryTypes.SELECT
    tmp = await this.sequelize.query(sql, { type: this.QueryTypes.SELECT })
    if (tmp.length > 0) {
      let res = tmp[0][column]
      return switchValType(res, column_type)
    } else {
      return switchValType('', column_type)
    }
  }


  /**
   * 取返回结果集的首行，某列的值
   * @param {*} sql 
   * @param {*} params 
   * @param {*} column_type 
   * @param {*} column 
   * @returns 
   */
  async queryScalarParam(sql, params, column_type = sqlTypeEnums.int, column = '') {
    let tmp = []
    //格式化 sql 语句
    sql = formatSql(sql, params)
    tmp = await this.sequelize.query(sql, { type: this.QueryTypes.SELECT })
    if (tmp.length > 0) {
      let fristRow = tmp[0]
      let res = '0'
      let data
      // 如果未传colums，通过查询结果自己计算
      if (!column) {
        let keys = Object.keys(fristRow)
        if (keys.length > 0) {
          // 取首行的对象的第一个key，作为首列
          column = keys[0]
        } else {
          return column_type == sqlTypeEnums.int ? 0 : ''
        }
      }
      res = fristRow[column]
      if (column_type == sqlTypeEnums.int) {
        if (typeof res == 'number') data = res
        if (typeof res == 'string') data = res != '' && res.length > 0 ? parseInt(res) : 0
      } else {
        data = res
      }
      return data
    } else {
      return column_type == sqlTypeEnums.int ? 0 : ''
    }
  }

  /**
   * 执行 SQL 查询语句并返回第一行结果
   * @param {*} sql 要执行的 SQL 查询语句
   * @param {*} params 查询参数
   * @returns 
   */
  async queryOne(sql, params) {
    if (!sql) {
      throw new Error('SQL statement is required.')
    }
    let tmp = []
    //格式化 sql 语句
    sql = formatSql(sql, params)
    if (this.dbType == sqlEnums.mssql) {
      tmp =
        (await this.sequelize.query(sql, {
          type: this.QueryTypes.SELECT
        })) || []
    } else {
      tmp =
        (await this.sequelize.query(sql, {
          type: this.QueryTypes.SELECT
        })) || []
    }

    if (tmp.length > 0) {
      return tmp[0]
    } else {
      return undefined
    }
  }

  /**
   * 对 sql 语句安全处理，防止 sql 注入
   * @param {*} sql 
   * @returns sql
   */
  async sanitizeSql(sql) {
    // 移除注释
    sql = sql.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/mg, '')
    // 防止 SQL 注入
    sql = sql.replace(/(['";])/g, '\\$1')
    return sql
  }

  async execParam(sql, params, spc) {
    spc = spc || sqlStateEnums.sqlClause
    //格式化 sql 语句
    sql = formatSql(sql, params)
    if (spc == sqlStateEnums.sqlClause) {
      //普通 SQL语句
      return await this.sequelize.query(sql)
    } else {
      //存储过程
      return await this.doProc(sql, spc)
    }
  }




  async bulkUpsert(model, key, values) {
    function _find(where) {
      return model.findOne({
        where
      })
    }

    function _update(value, where) {
      return model
        .update(value, {
          where
        })
        .then(() => _find(where))
    }
    let promises = values.map(value => {
      let where = {
        [key]: value[key]
      }
      return model
        .findOrCreate({
          where,
          defaults: value
        })
        .spread((result, created) => {
          return !created ? _update(value, where) : Promise.resolve(result)
        })
    })
    return Promise.all(promises)
  }
}

/**
 * 格式化 sql 语句
 * @param {*} sql 
 * @param {*} params 
 * @returns 
 */
const formatSql = async (sql = null, params = null) => {
  if (!sql) {
    throw new Error('SQL statement is required.')
  }
  //格式化 sql 语句
  sql = params ? await this.reaplceSqlParam(sql, params) : sql
  sql = this.sanitizeSql(sql)
  return sql
}

const splitResult = arr => {
  if (arr.length === 0) return arr
  let _list = []

  //总共有多个结果集对象
  for (let i = 0; i < arr.length; i++) {
    // 单个结果集 对象
    let one_set = arr[i]
    var one_set_keys = Object.keys(one_set)
    var tmp = []
    for (let key in one_set_keys) {
      let row = one_set[key]
      tmp.push(row)
    }
    _list.push({ id: i, data: tmp })
  }
  return _list
}

/**
 * 转换数据类型方法
 * @param {*} val 
 * @param {*} type 
 * @returns 
 */
const switchValType = (val, type = sqlTypeEnums.int) => {
  if (val) {
    const typeMap = {
      [sqlTypeEnums.int]: parseInt(val),
      [sqlTypeEnums.float]: parseFloat(val),
      [sqlTypeEnums.str]: `${val}`
    }
    return typeMap[type]
  } else {
    const typeMap = {
      [sqlTypeEnums.int]: 0,
      [sqlTypeEnums.float]: 0,
      [sqlTypeEnums.str]: ''
    }
    return typeMap[type]
  }
}




const strDo = async str => {
  str = str.replace(/\(/, ' ')
  str = str.replace(/\)/, ' ')
  str = str.replace(/\</, '(')
  str = str.replace(/\>/, ')')
  return str
}

module.exports = sequelize => {
  return new DbHelper(sequelize)
}
