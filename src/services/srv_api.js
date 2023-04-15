'use strict'

// 由于在knex查询时会用到
const moment = require('moment')
const { SYSTEM } = require('@config')
const { dbHelper, dbType, sequelize, api } = db

// 根据 apiid获取相应的脚本
const getScriptByApiId = async apiId => {
  let res_data = { script: '', script_type: '', exec_type: '', exec_count: 0 }
  if (!apiId) return res_data
  let attributes = ['script', 'script_type', 'exec_type', 'exec_count']
  let data = await api.findOne({ attributes: attributes, where: { id: apiId }, raw: true })

  if (!data) return res_data
  let { script, script_type, exec_type, exec_count } = data

  exec_count = exec_count ? parseInt(exec_count) : 0
  return { script, script_type, exec_type, exec_count }
}

const getScriptByFunId = async (btn_id, dev) => {
  if (!btn_id) return { script: '', script_type: '' }
  let data = {}
  let _sql = ''

  if (dev == 'Y') {
    _sql = `select script_type, script from api where id = (select api_id from dev_menu where id='${btn_id}')`
  } else {
    _sql = `select script_type, script from api where id = (select api_id from pf_menu where id='${btn_id}')`
  }
  data = await dbHelper.queryOne(_sql)
  if (!data) return { script: '', script_type: '' }
  let script = data ? data.script : ''
  let script_type = data ? data.script_type : ''
  return { script, script_type }
}

// 根据菜单功能id获取对应的数据
const getApiDataByFunId = async ({ btn_id, params, dev }) => {
  let data = []
  if (!btn_id) return data
  let { script, script_type } = await getScriptByFunId(btn_id, dev)
  data = await getApiData({ script, script_type, params })
  return data
}

// 根据ApiId获取对应的数据
const getApiDataByApiId = async ({ apiId, params }) => {
  let data = []
  if (!btn_id) return data
  let { script, script_type } = await getScriptByApiId(apiId)
  data = await getApiData({ script, script_type, params })
  return data
}

// 根据ApiId获取对应的数据
const getApiData = async ({ script, script_type, params }) => {
  console.log('script: ======================================', script)
  // 默认为0， sql模式
  script_type = script_type || '0'
  let res_data = { data: [], dbType: dbType, script_type: script_type }
  let data = []
  logger.info(`script=${script}, script_type=${script_type}`)
  //如果未定义按钮 sql，直接返回空
  // if (!script || !script_type) return data
  if (!script) return data

  if (!['0', '1', '2', '3', '9'].includes(script_type)) {
    return data
  }
  console.log('params: ', params)
  if (script_type == '0') {
    // 普通sql
    data = await dbHelper.sqlQuery(script, params, script_type)
  } else if (script_type == '1') {
    // 无返回值存储过程  ???
    data = await dbHelper.sqlQuery(script, params, script_type)
  } else if (script_type == '2') {
    // 带返回值存储过程  ???
    data = await dbHelper.sqlQuery(script, params, script_type)
  } else if (script_type == '3') {
    // 执行存储过程返回多个SELECT  ???
    data = await dbHelper.sqlQuery(script, params, script_type)
  } else if (script_type == '9') {
    let _script = await dbHelper.reaplceSqlParam(script, params)
    logger.info(`script=${_script}`)

    data = await await eval(_script)
  }
  res_data.data = data
  return res_data
}

const getDataByApiId = async ({ apiId, params, restype }) => {
  let res_data = { data: [], dbType: dbType, script_type: '' }
  try {
    if (!apiId) return res_data

    let { script, script_type, exec_type, exec_count } = await getScriptByApiId(apiId)
    res_data.script_type = script_type
    //如果未定义按钮 sql，直接返回空
    if (!script) return res_data

    if (exec_type == 'exec') {
      // 执行 增删改
      let res_tmp = await dbHelper.execParam(script, params, script_type)
      console.log(script, params, script_type, res_tmp, '=================execParam------------')
      res_data.data = true
    } else {
      let data = []
      // 查询
      // 同一个sql希望做到，根据前端传递的restype返回不同的结果集，所以此处 exec_type，并非完全等同于 restype
      // exec_type 只是从大方向上确定了是查询，还是 增删改；
      exec_type = exec_type || restype
      //禁止使用存储过程
      if (exec_type == 'scalar') {
        data = await dbHelper.queryScalarParam(script, params)
      } else if (exec_type == 'one') {
        data = await dbHelper.queryOne(script, params)
      } else {
        // 表格
        data = await dbHelper.sqlQuery(script, params, script_type)
      }
      res_data.data = data
    }
    if (SYSTEM.DEBUG) {
      await api.update({ exec_count: parseInt(exec_count) + 1 }, { where: { id: apiId } })
    }
  } catch (err) {
    console.log(`srv_api.getDataByApiId异常：${err}`)
    res_data.data = false
  }
  return res_data
}

const execSql = async ({ btn_id, params, dev }) => {
  if (!btn_id) return ''
  let { script, script_type } = await getSql(btn_id, dev)
  //如果未定义按钮 sql，直接返回空
  if (!script) return ''
  let res = await dbHelper.execParam(script, params, script_type)
  return res
}

const doProc = async ({ btn_id, params, dev }) => {
  if (!btn_id) return ''
  let { script, script_type } = await getSql(btn_id, dev)
  //如果未定义按钮 sql，直接返回空
  if (!script) {
    return [{ msg: 'script is not define' }]
  }
  return await dbHelper.sqlQuery(script, params, script_type)
}

module.exports = {
  getScriptByApiId,
  getScriptByFunId,
  getApiDataByFunId,
  getApiDataByApiId,
  execSql,
  doProc,
  getDataByApiId,
  getApiData
}
