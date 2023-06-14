/**
 * =================================================
 *  数据库模型工具
 * =================================================
 */

const dayjs = require('dayjs')
const dateFmt = 'YYYY-MM-DD HH:mm:ss'


/**
 * 数据库模型返回数据时间格式化
 * @param {*} data 
 * @returns 
 */
const fmtRow = async data => {
  let row = data
  if (data.hasOwnProperty('dataValues')) {
    row = data['dataValues']
  }
  if (row.hasOwnProperty('created_at')) {
    row['created_at'] = row.created_at ? dayjs(row.created_at).format(dateFmt) : ''
  }
  if (row.hasOwnProperty('updated_at')) {
    row['updated_at'] = row.updated_at ? dayjs(row.updated_at).format(dateFmt) : ''
  }
  return row
}

/**
 * 数据库模型返回数据时间格式化
 * @param {*} data 
 * @returns 
 */
const fmtFun = async result => {
  if (!result) return result
  let res = []
  if (Array.isArray(result)) {
    result.forEach(async (row, index) => {
      let data = await fmtRow(row)
      res.push(data)
    })
  } else {
    let data = await fmtRow(result)
    res.push(data)
  }
  return res
}

module.exports = {
  fmtFun: fmtFun
}
