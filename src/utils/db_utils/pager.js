'use strict';

const getPageInfo = params => {
  let currentPage = 1;
  let pageSize = 100000;
  let data = { currentPage: 1, pageSize: 100000, pageStart: 1 };

  if (params.hasOwnProperty('page') && params.hasOwnProperty('rows')) {
    currentPage = parseInt(params.page) || 1;
    pageSize = parseInt(params.rows) || 100000;
  } else if (params.hasOwnProperty('pageNo') && params.hasOwnProperty('pageSize')) {
    currentPage = parseInt(params.pageNo) || 1;
    pageSize = parseInt(params.pageSize) || 100000;
  }
  // amis 分页参数
  else if (params.hasOwnProperty('page') && params.hasOwnProperty('perPage')) {
    currentPage = parseInt(params.page) || 1;
    pageSize = parseInt(params.perPage) || 100000;
  } else {
    console.log('分页时未传递page、rows参数！采用默认分页参数进行分页！');
  }

  data.currentPage = currentPage;
  data.pageSize = pageSize;
  data.pageStart = pageSize * (currentPage - 1);
  return data;
};

const getPager = (page = 1, rows = 100000) => {
  let data = { currentPage: 1, pageSize: 100000, pageStart: 1 };
  let currentPage = parseInt(page) || 1;
  let pageSize = parseInt(rows) || 100000;
  data.currentPage = currentPage;
  data.pageSize = pageSize;
  data.pageStart = pageSize * (currentPage - 1);
  return data;
};

module.exports = {
  getPageInfo,
  getPager,
};
