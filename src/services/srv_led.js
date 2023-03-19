'use strict'

const { sequelize, Led_Projects, Led_Projectdatas } = db

// Led_Projects, Led_Projectdatas  对应的model要求字段首字母小写，为了适配go-view前台，所以只能在model层进行字段的处理

const getProjectsById = async id => {
  let data = {}
  data = await Led_Projects.findOne({ where: { id: id }, raw: true })
  return data
}

const project_delete = async id => {
  console.log('id: ', id)
  let ok = true

  let transaction
  try {
    transaction = await sequelize.transaction()
    await Led_Projectdatas.destroy({ where: { projectId: id }, transaction: transaction })
    await Led_Projects.destroy({ where: { id: id }, transaction: transaction })
    await transaction.commit()
  } catch (err) {
    ok = false
    console.log('project_delete failed due to DB error', err)
    if (transaction) await transaction.rollback()
  } finally {
  }
  return ok
}

const project_list = async ({ page, limit }) => {
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
    let tmp = await Led_Projects.findAndCountAll(condition)
    if (tmp) {
      res.count = tmp.count
      res.data = tmp.rows
    }
  } catch (error) {}
  return res
}

const getProjectdatasById = async id => {
  let data = {}
  data = await Led_Projectdatas.findOne({ where: { id: id }, raw: true })
  return data
}

const getProjectdatasByProjectId = async projectId => {
  let data = {}
  data = await Led_Projectdatas.findOne({ where: { projectId: projectId }, raw: true })
  return data
}

const project_publish = async ({ id: projectId, state }) => {
  let ok = false
  try {
    let data = await Led_Projects.findOne({ where: { id: projectId }, raw: true })
    console.log('project_publish data: ', data)
    if (data) {
      await Led_Projects.update({ state: state }, { where: { id: projectId } })
      ok = true
    }
  } catch (err) {
    console.log('project_publish failed due to DB error', err)
    return data
  } finally {
  }
  return ok
}

const project_upsert = async params => {
  let data = {}
  try {
    let _params = {}
    let { projectName, indexImage, remarks } = params
    _params = { projectName, indexImage, remarks }
    if (params.hasOwnProperty('id')) {
      let id = params.id
      data = await Led_Projects.findOne({ where: { id: id }, raw: true })
      if (data) {
        await Led_Projects.update(_params, { where: { id: id } })
        data = await Led_Projects.findOne({ where: { id: id }, raw: true })
      }
    } else {
      _params = { projectName, indexImage, remarks, state: -1, isDelete: -1, createTime: new Date() }
      data = await Led_Projects.create(_params, { returning: true, raw: true })
    }
  } catch (err) {
    console.log('project_upsert failed due to DB error', err)
    return data
  } finally {
  }
  return data
}

const project_data_save = async ({ projectId, content: contentData }) => {
  let data = {}
  let transaction
  try {
    transaction = await sequelize.transaction()
    data = await Led_Projectdatas.findOne({ where: { projectId: projectId }, raw: true, transaction: transaction })
    if (data) {
      await Led_Projectdatas.update({ contentData: contentData }, { where: { id: data.id }, transaction: transaction })
    } else {
      await Led_Projectdatas.create({ projectId: projectId, contentData: contentData, createTime: new Date() }, { transaction: transaction })
    }
    data = await Led_Projectdatas.findOne({ where: { projectId: projectId }, raw: true, transaction: transaction })
    await transaction.commit()
  } catch (err) {
    console.log('project_data_save failed due to DB error', err)
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
  project_list,
  project_upsert,
  project_delete,
  project_publish,
  project_data_save
}
