'use strict'

const _ = require('lodash')
const { toTree } = require('@zhengxs/js.tree')
const { chart_line2, chart_bar, chart_pie } = require('./chart')

// 不同前端对应不同的返回值要求
const CHG_RES_VALUE = {
  default: {
    defaultVal: {},
    fun: defaultFun
  },
  data: {
    defaultVal: { status: 0, msg: '', data: [] },
    fun: dataFun
  },
  scalar: {
    defaultVal: {},
    fun: scalarFun
  },
  one: {
    defaultVal: {},
    fun: oneFun
  },
  exec: {
    defaultVal: { status: 0, msg: '' },
    fun: execFun
  },
  amis: {
    defaultVal: { status: 0, msg: '', data: { total: 0, items: [] } },
    fun: amisFun
  },
  amis_admin: {
    defaultVal: { status: 0, msg: '', data: { count: 0, rows: [] } },
    fun: amisAdminFun
  },
  datagrid: {
    defaultVal: { total: 0, rows: [] },
    fun: datagridFun
  },
  tree: {
    defaultVal: [],
    fun: treeFun
  },
  jtab: {
    defaultVal: { total: 0, rows: [] },
    fun: jtabFun
  },
  chart_line: {
    defaultVal: { total: 0, rows: [] },
    fun: chartLineFun
  },
  chart_bar: {
    defaultVal: {},
    fun: chartBarFun
  },
  chart_pie: {
    defaultVal: {},
    fun: chartPieFun
  },
  chart_x: {
    defaultVal: { total: 0, rows: [] },
    fun: chartXFun
  }
}

async function defaultFun(api_data, defaultVal, params) {
  let data = api_data.data
  return _.defaults(data || {}, defaultVal)
}

async function scalarFun(api_data, defaultVal, params) {
  let data = api_data.data
  return _.defaults(data || {}, defaultVal)
}

async function oneFun(api_data, defaultVal, params) {
  let data = api_data.data
  return _.defaults(data || {}, defaultVal)
}

async function execFun(api_data, defaultVal, params) {
  let _data = {}
  let data = api_data.data
  if (data == true) _data = { status: 1, msg: '执行成功！' }
  else _data = { status: 0, msg: '执行失败！' }
  return _.defaults(_data || {}, defaultVal)
}

async function dataFun(api_data, defaultVal, params) {
  let newVal = {}
  newVal.data = api_data.data
  return _.defaults(newVal || {}, defaultVal)
}

async function gridKit(api_data) {
  let rows = []
  let total = 0
  let is_pager = false
  let { data, dbType, script_type } = api_data
  // console.log('dbType, script_type: ', api_data, dbType, script_type)
  if (script_type == '9') {
    if (data.hasOwnProperty('pagination')) {
      // 如果含有分页信息，返回结果如下
      // let res_data = {
      //   data: [],
      //   pagination: {
      //     total: 99,
      //     lastPage: 10,
      //     perPage: 10,
      //     currentPage: 1,
      //     from: 0,
      //     to: 10
      //   }
      // }
      let { data: _data, pagination } = data
      total = pagination.total
      rows = _data
    } else {
      total = data.length
      rows = data
    }
  } else if (script_type == '0' && data.length > 0) {
    let first_row = data[0]
    if (dbType == 'mysql') {
      // mysql返回的结果样式
      // [{ 0: { total: '7' } }, { 0: {} , 1: {} , 2: {} }]
      // 如果有total的，total为第一个对象；真实的数据为第二个对象
      let first_val = first_row['0']
      if (first_val && first_val.hasOwnProperty('total')) {
        total = first_val['total']
        for (let i in data[1]) {
          rows.push(data[1][i]) //值
        }
        is_pager = true
      } else {
        rows = data
      }
    } else if (dbType == 'mssql') {
      // mssql返回的结果样式
      // [ { total: 13 }, {}, {}, {}]
      if (first_row && first_row.hasOwnProperty('total')) {
        total = first_row['total']
        rows = data.slice(1, data.length)
        is_pager = true
      } else {
        rows = data
      }
    }
  }
  if (typeof total === 'string') total = Number(total)
  return { total, rows }
}

async function amisFun(api_data, defaultVal, params) {
  // 要求配置：前面必须为total记录条数，后面为查询内容；
  let { total, rows } = await gridKit(api_data)
  let _data = await _.defaults(
    {
      data: {
        total: total,
        items: rows
        // hasNext: true
      }
    },
    defaultVal
  )
  return _data
}

async function amisAdminFun(api_data, defaultVal, params) {
  // 要求配置：前面必须为total记录条数，后面为查询内容；
  let { total, rows } = await gridKit(api_data)
  let _data = await _.defaults(
    {
      data: {
        count: total,
        rows: rows
        // hasNext: true
      }
    },
    defaultVal
  )
  return _data
}

async function datagridFun(api_data, defaultVal, params) {
  // 要求配置：前面必须为total记录条数，后面为查询内容；
  let { total, rows } = await gridKit(api_data)
  let _data = await _.defaults(
    {
      total: total,
      rows: rows
    },
    defaultVal
  )
  return _data
}

async function treeFun(api_data, defaultVal, params) {
  let newVal = []
  //使用 构建tree所需要返回的数据库
  // 具体的用法参考 /code3/2-dev/test/tree/test.html
  // https://gitee.com/zhengxs2018/js.tree/blob/main/docs/transform/toTree.md
  newVal = toTree(api_data.data)
  return newVal
}

async function jtabFun(api_data, defaultVal, params) {
  let newVal = {}

  newVal.data = api_data.data
  return _.defaults(newVal || {}, defaultVal)
}

async function chartLineFun(api_data, defaultVal, params) {
  let newVal = {}
  //折线图
  // chart_option = {
  //   legend_field: 'station_no',
  //   legend_sub: [
  //     { legend: '_计划', series_field: 'plan_num' },
  //     { legend: '_实际', series_field: 'act_num' }
  //   ],
  //   xaxis_field: 'plan_date',
  //   series_field: '',
  //   labelOption: {}
  // }
  newVal = await chart_line2(params.chart_option, api_data.data)
  return _.defaults(newVal || {}, defaultVal)
}

async function chartBarFun(api_data, defaultVal, params) {
  let newVal = {}
  //柱状图
  // chart_option = {
  //   legend_field: 'station_no',
  //   xaxis_field: 'plan_date',
  //   series_field: 'plan_num',
  //   labelOption: {
  //     show: true,
  //     position: 'insideBottom',
  //     distance: 15,
  //     align: 'left',
  //     verticalAlign: 'middle',
  //     rotate: 90,
  //     formatter: '{c}  {name|{a}}',
  //     fontSize: 14,
  //     rich: {
  //       name: {
  //         textBorderColor: '#fff'
  //       }
  //     }
  //   }
  // }
  newVal = await chart_bar(params.chart_option, api_data.data)
  return _.defaults(newVal || {}, defaultVal)
}

async function chartPieFun(api_data, defaultVal, params) {
  let newVal = {}
  //饼图
  //   newVal = await chart_pie(params.chart_option, api_data.data)
  //   return _.defaults(newVal || {}, defaultVal)
  return _.defaults(api_data.data || {}, defaultVal)
}

async function chartXFun(api_data, defaultVal, params) {
  let newVal = {}

  newVal.data = api_data.data
  return _.defaults(newVal || {}, defaultVal)
}

// 判断是否是函数
const isFunction = obj => {
  return typeof obj === 'function' && typeof obj.nodeType != 'number'
}
/*
 * 按照前端不同的需求，返回不同的值
 */
const getResData = async (restype, api_data, params) => {
  restype = restype || 'default'
  let item = CHG_RES_VALUE[restype]
  let defaultVal = item.defaultVal
  let fun = item.fun
  let resVal = defaultVal
  if (fun && isFunction(fun)) resVal = await fun(api_data, defaultVal, params)
  return resVal
}

const getDefaultVal = async restype => {
  restype = restype || 'default'
  let item = CHG_RES_VALUE[restype]
  let defaultVal = item.defaultVal
  return defaultVal
}

module.exports = {
  getResData: getResData,
  getDefaultVal: getDefaultVal
}
