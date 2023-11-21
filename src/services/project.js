'use strict'

const { sequelize, Projects, Projectdatas } = db
const { log } = require('@middleware/logger.js')
/**
 * 获取项目列表
 * @param {*} param0
 * @returns
 */
const getProjectList = async ({ page, limit }) => {
  let res = { data: [], count: 0 }
  try {
    let _where = {}
    let pageSize = parseInt(limit)
    let pageStart = pageSize * (parseInt(page) - 1)
    let condition = {
      where: _where,
      limit: pageSize,
      offset: pageStart,
      order: [['id', 'ASC']],
      raw: true
    }
    let tmp = await Projects.findAndCountAll(condition)
    if (tmp) {
      res.count = tmp.count
      res.data = tmp.rows
    }
  } catch (error) { }
  return res
}

/**
 * 创建/更新项目
 * @param {*} params
 * project.id: null, 项目主键
 * project.indexImage: null, 图片地址
 * project.projectName: null, 项目名称
 * project.remarks:null, 项目简介
 * user: {}, 请求用户信息
 * @returns
 */
const setProjectUpsert = async params => {
  let data = {}
  try {
    let { projectName = null, indexImage = null, remarks = null } = params
    log('debug', `setProjectUpsert params ==${JSON.stringify(params)}`)
    if (params.hasOwnProperty('id')) {
      //判断是否有项目 id，存在更新
      let id = params.id
      data = await Projects.findOne({ where: { id: id }, raw: true })
      log('debug', `setProjectUpsert data1 ==${JSON.stringify(data)}`)
      if (data) {
        //存在项目，更新数据
        await Projects.update({ projectName, indexImage, remarks }, { where: { id: id } })
        data = await Projects.findOne({ where: { id: id }, raw: true })
        log('debug', `setProjectUpsert data2 ==${JSON.stringify(data)}`)
      }
    } else {
      //不存在项目 id，创建项目
      data = await Projects.create(
        {
          createUserId: params?.user?.id,
          projectName,
          indexImage,
          remarks,
          state: -1,
          isDelete: -1,
          createTime: new Date()
        },
        {
          returning: true,
          raw: true
        }
      )
      log('debug', `setProjectUpsert data3 ==${JSON.stringify(data)}`)
    }
  } catch (err) {
    return err
  }
  return data
}

/**
 * 删除项目
 * @param { Array } id 项目id
 * @returns
 */
const delProject = async ({ ids = null }) => {
  let ok = true
  let transaction = null
  if (!ids) {
    return false
  }
  try {
    transaction = await sequelize.transaction()
    await Projectdatas.destroy({ where: { projectId: ids }, transaction: transaction })
    await Projects.destroy({ where: { id: ids }, transaction: transaction })
    await transaction.commit()
  } catch (err) {
    ok = false
    if (transaction) await transaction.rollback()
  }
  return ok
}

const getProjectsById = async id => {
  let data = {}
  data = await Projects.findOne({ where: { id: id }, raw: true })
  return data
}

const getProjectdatasById = async id => {
  let data = {}
  data = await Projectdatas.findOne({ where: { id: id }, raw: true })
  return data
}

const getProjectdatasByProjectId = async projectId => {
  let data = {}
  data = await Projectdatas.findOne({ where: { projectId: projectId }, raw: true })
  return data
}

const project_publish = async ({ id: projectId, state }) => {
  let ok = false
  try {
    let data = await Projects.findOne({ where: { id: projectId }, raw: true })
    if (data) {
      await Projects.update({ state: state }, { where: { id: projectId } })
      ok = true
    }
  } catch (err) {
    return err
  } finally {
  }
  return ok
}

const project_data_save = async ({ projectId, content: contentData }) => {
  let data = {}
  let transaction
  try {
    transaction = await sequelize.transaction()
    data = await Projectdatas.findOne({ where: { projectId: projectId }, raw: true, transaction: transaction })
    if (data) {
      await Projectdatas.update({ contentData: contentData }, { where: { id: data.id }, transaction: transaction })
    } else {
      await Projectdatas.create({ projectId: projectId, contentData: contentData, createTime: new Date() }, { transaction: transaction })
    }
    data = await Projectdatas.findOne({ where: { projectId: projectId }, raw: true, transaction: transaction })
    await transaction.commit()
  } catch (err) {
    if (transaction) await transaction.rollback()
    return data
  } finally {
  }
  return data
}

module.exports = {
  getProjectsById,
  getProjectdatasById,
  getProjectdatasByProjectId,
  getProjectList,
  setProjectUpsert,
  delProject,
  project_publish,
  project_data_save
}
