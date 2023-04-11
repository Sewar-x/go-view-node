'use strict'

const chg_val = (val, type = 'int') => {
  if (val) {
    if (type == 'int') return parseInt(val)
    else if (type == 'float') return parseFloat(val)
    else if (type == 'str') return `${val}`
  } else {
    if (type == 'int') return 0
    else if (type == 'float') return 0
    else if (type == 'str') return ''
  }
}

class DbHelper {
  constructor(sequelize) {
    this.sequelize = sequelize
    this.dbType = sequelize?.options?.dialect
    this.QueryTypes = sequelize.QueryTypes //查询类型
  }

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
  
  //spc查询类型
  //dg按照datagrid的方式构建page_data
  //
  async sqlQuery(sql, params, spc, dg) {
    spc = spc || '0'
    dg = dg || '0'
    sql = params ? await this.reaplceSqlParam(sql, params) : sql
    if (spc == '0') {
      //普通 SQL语句
      return await this.query(sql)
    } else if (spc == '9') {
      //普通 SQL语句--返回多个dataset
      return await this.query(sql, true)
    }
    return await this.procQuery(sql, spc, dg) //存储过程
  }

  async procPrefix(sql) {
    let prefix = ''
    switch (this.dbType) {
      case 'mysql': //mysql
        prefix = 'call '
        break
      case 'mssql': //sqlserver
        prefix = 'exec '
        sql = await strDo(sql)
        break
      case 'sqlite': //sqlite
        prefix = 'call '
        break
      default:
        prefix = 'call '
    }
    sql = prefix + ' ' + sql
    return sql
  }

  async query(sql, multi = false) {
    let res = []
    if (!sql) return res
    if (multi) {
      if (this.dbType == 'mysql') res = await this.sequelize.query(sql, { multipleStatements: true, type: this.QueryTypes.SELECT }).then(splitResult)
      else if (this.dbType == 'mssql') {
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

  // 取返回结果集的首行，指定某列的值
  async queryScalar(sql, column, column_type = 'int') {
    let tmp = []
    // 必须使用 type: this.QueryTypes.SELECT
    tmp = await this.sequelize.query(sql, { type: this.QueryTypes.SELECT })
    if (tmp.length > 0) {
      let res = tmp[0][column]
      return chg_val(res, column_type)
    } else {
      return chg_val('', column_type)
    }
  }

  // 取返回结果集的首行，某列的值
  async queryScalarParam(sql, params, column_type = 'int', column = '') {
    let tmp = []
    sql = params ? await this.reaplceSqlParam(sql, params) : sql
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
          return column_type == 'int' ? 0 : ''
        }
      }
      res = fristRow[column]
      if (column_type == 'int') {
        if (typeof res == 'number') data = res
        if (typeof res == 'string') data = res != '' && res.length > 0 ? parseInt(res) : 0
      } else {
        data = res
      }
      return data
    } else {
      return column_type == 'int' ? 0 : ''
    }
  }

  // 取返回结果集的首行
  async queryOne(sql, params) {
    let tmp = []
    sql = params ? await this.reaplceSqlParam(sql, params) : sql
    if (this.dbType == 'mssql')
      tmp =
        (await this.sequelize.query(sql, {
          type: this.QueryTypes.SELECT
        })) || []
    else
      tmp =
        (await this.sequelize.query(sql, {
          type: this.QueryTypes.SELECT
        })) || []
    if (tmp.length > 0) {
      return tmp[0]
    } else {
      return undefined
    }
  }

  async execParam(sql, params, spc) {
    spc = spc || '0'
    sql = params ? await this.reaplceSqlParam(sql, params) : sql
    if (spc == '0') {
      //普通 SQL语句
      return await this.sequelize.query(sql)
    } else {
      //存储过程
      return await this.doProc(sql, spc)
    }
  }

  async exec(sql) {
    return await this.sequelize.query(sql)
  }

  async doProc(sql, spc) {
    if (this.dbType == 'mssql') {
      //只允许取存储过程返回的 dataset 中的第一个 datatable
      if (spc == '1' || spc == '3') sql = await this.procPrefix(sql)
      return await this.sequelize.query(sql, {
        type: this.QueryTypes.SELECT
      })
    } else if (this.dbType == 'mysql') {
      if (spc == '1' || spc == '3') {
        sql = await this.procPrefix(sql)
      }
      if (spc == '1') {
        return await this.sequelize.query(sql)
      }
      if (spc == '2' || spc == '3') {
        return await this.sequelize.query(sql, {
          // raw: true,
          // type: this.QueryTypes.SELECT
        })
      }
    } else {
      return await this.sequelize.query(sql)
    }
  }

  async procQuery(sql, spc, dg) {
    dg = dg || 0
    let res,
      total = -1
    res = await this.doProc(sql, spc)
    if (dg == 0) {
      return res
    }
    if (this.dbType == 'mssql') {
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
    if (this.dbType == 'mysql') {
      if (spc == '1') {
        return {
          total: res.length,
          rows: res
        }
      }
      if (spc == '2') {
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
    if (spc == '3') {
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
