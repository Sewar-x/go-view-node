'use strict'

const { getResData, getDefaultVal } = require('@plugins/ApiRes')
const srv_api = require('@services/srv_api')
const Obj = require('@utils/Obj')
const Res = require('@utils/Res')
const util = require('util')
const { api } = db

/**
 * 根据id获取 api 接口
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getDataByApiId = async (req, res, next) => {
	let data = {}
	let _m = req.method
	let _query = {}
	// 建议采用POST方法， GET方法仅仅是为了方便测试
	if (_m == 'GET') {
		_query = req.query
	} else if (_m == 'POST') {
		_query = req.body
	}
	let apiId = _query.apiId
	if (!apiId) {
		data = await getDefaultVal(_query.restype)
		return res.sendResponse({
			code: -1,
			data,
			msg: '未传递apiId参数！'
		})
	} else {
		data = await getDataApiId(_query)
		return res.sendResponse(data)
	}
}

/**
 * 获取 api 数据
 * @param {*} params 
 * @returns 
 */
const getDataApiId = async params => {
	let data = {}
	let apiId = params.apiId
	// 分页参数计算
	// easyui datagrid
	if (params.hasOwnProperty('page') && params.hasOwnProperty('rows')) {
		params.offset = params['rows'] * (params['page'] - 1)
	}
	//
	if (params.hasOwnProperty('pageNo') && params.hasOwnProperty('pageSize')) {
		params.offset = params['pageSize'] * (params['pageNo'] - 1)
		params['rows'] = params['pageSize']
	}
	// amis 分页参数
	if (params.hasOwnProperty('page') && params.hasOwnProperty('perPage')) {
		params.offset = params['perPage'] * (params['page'] - 1)
		params['rows'] = params['perPage']
	}
	let restype = params.restype
	if (!apiId) {
		data = await getDefaultVal(restype)
		data.msg = '未传递apiId参数！'
		data.code = -1
		return data
	} else {
		data.msg = ''
		data.code = 0
	}

	let _data = await srv_api.getDataByApiId({
		apiId: apiId,
		params: Obj.allProps(params),
		restype: restype
	})
	data = await getResData(restype, _data, params)
	return data
}

/**
 * 新增修改
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const api_update = async (req, res, next) => {
	let _m = req.method
	if (_m == 'GET') {
		let _query = req.query
		let id = req.body.id || req.query.id
		// let uuid = req.body.uuid ||req.query.uuid
		let storeKey = _query.storeKey,
			page_data = {
				data: {},
				storeKey: storeKey,
				url: Res.getBaseUrl(req.originalUrl)
			}
		try {
			let tmp = []
			// if (uuid) {
			//   tmp = await sop_bm_workpos.findByPk({uuid : uuid})
			//   page_data.data = tmp['dataValues']
			// }else
			if (id) {
				tmp = await api.findByPk(id)
				page_data.data = tmp['dataValues']
			}
		} catch (err) {
			logger.info('api_update failed due to DB error', err)
		} finally {
			res.render(`pf/api_menuUiForm`, page_data)
		}
	} else if (_m == 'POST') {
		let obj = req.body,
			page_data = G.HTTP_MSG_Suc
		try {
			if (!obj.id) {
				obj.id = uuid.v4()
				await api.create(obj)
			} else {
				await api.upsert(obj)
			}
		} catch (err) {
			logger.info('api_update failed due to DB error', err)
			page_data = G.HTTP_MSG_Err
		} finally {
			res.json(page_data)
		}
	}
}

// 删除
const api_del = async (req, res, next) => {
	let id = req.body.id,
		uuid = req.body.uuid,
		page_data = G.HTTP_MSG_Suc
	let flag
	try {
		if (uuid) {
			flag = api.destroy({
				where: {
					uuid: uuid
				}
			})
		} else if (id) {
			flag = api.destroy({
				where: {
					id: id
				}
			})
		}
	} catch (err) {
		logger.info('modelDel failed due to DB error', err)
		page_data = G.HTTP_MSG_Err
	} finally {
		return resJson(res, page_data)
	}
}

//列管理
const api_test = async (req, res, next) => {
	let _m = req.method
	if (_m == 'GET') {
		let _query = req.query
		let id = req.body.id || req.query.id
		// let uuid = req.body.uuid ||req.query.uuid
		let storeKey = _query.storeKey,
			page_data = {
				data: {},
				storeKey: storeKey,
				url: Res.getBaseUrl(req.originalUrl)
			}
		try {
			let tmp = []
			if (id) {
				tmp = await api.findByPk(id)
				page_data.data = tmp['dataValues']
			}
		} catch (err) {
			logger.info('api_test failed due to DB error', err)
		} finally {
			res.render(`pf/api_test`, page_data)
		}
	}
}

module.exports = {
	getDataApiId: getDataApiId,
	getDataByApiId: getDataByApiId,
	api_update: api_update,
	api_del: api_del,
	api_test: api_test,
	// api过时的写法
	fn1: util.deprecate(getDataApiId, 'foo() is deprecated, use bar() instead', 'DEP0001')
}
