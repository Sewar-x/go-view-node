'use strict'
/**
 * =================================================
 *  数据库分页查询相关方法封装
 * =================================================
 */

/**
 * 解析分页参数，根据传入的参数，返回一个包含当前页码、每页大小以及查询起始位置的对象
 * @param {*} params 
 * @returns 
 */
const getPageInfo = params => {
  let currentPage = 1
  let pageSize = 100000
  // 初始化当前页码、每页大小以及查询起始位置
  let data = { currentPage: 1, pageSize: 100000, pageStart: 1 }
  // 如果传入的参数包含 page 和 rows 属性，则使用这两个属性作为分页参数
  if (params.hasOwnProperty('page') && params.hasOwnProperty('rows')) {
    currentPage = parseInt(params.page) || 1
    pageSize = parseInt(params.rows) || 100000
    // 如果传入的参数包含 page 和 perPage 属性，则使用这两个属性作为分页参数
  } else if (params.hasOwnProperty('pageNo') && params.hasOwnProperty('pageSize')) {
    currentPage = parseInt(params.pageNo) || 1
    pageSize = parseInt(params.pageSize) || 100000
  }
  // 如果传入的参数包含 page 和 perPage 属性，则使用这两个属性作为分页参数
  else if (params.hasOwnProperty('page') && params.hasOwnProperty('perPage')) {
    currentPage = parseInt(params.page) || 1
    pageSize = parseInt(params.perPage) || 100000
  }
  //分页时未传递page、rows参数！采用默认分页参数进行分页
  data.currentPage = currentPage
  data.pageSize = pageSize
  data.pageStart = pageSize * (currentPage - 1)
  return data
}


/**
 * 计算查询起始位置的函数，根据传入的页码和每页大小，返回一个包含当前页码、每页大小以及查询起始位置的对象
 * @param {*} page 
 * @param {*} rows 
 * @returns 
 */
const getPager = (page = 1, rows = 100000) => {
  // 初始化当前页码、每页大小以及查询起始位置
  let data = { currentPage: 1, pageSize: 100000, pageStart: 1 }
  let currentPage = parseInt(page) || 1
  let pageSize = parseInt(rows) || 100000
  data.currentPage = currentPage
  data.pageSize = pageSize
  data.pageStart = pageSize * (currentPage - 1)
  return data
}

module.exports = {
  getPageInfo,
  getPager
}
