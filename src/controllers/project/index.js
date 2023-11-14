'use strict'

const { SYSTEM } = require('@config')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty')
const moment = require('moment')
const projectServ = require('@services/project')
const File = require('@utils/File')

/**
 * 获取项目列表
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const project_list = async (req, res, next) => {
  try {
    let { page, limit } = req.getReqParams()
    let { data, count } = await projectServ.getProjectList({ page, limit })
    const { id } = req.user
    data.forEach(pro => {
      // 新增字段：created 表示是否为当前用户创建的项目
      pro.created = Number(pro.createUserId) === Number(id)
    })
    return res.sendResponse({
      data,
      params: {
        count,
        limit: Number(limit)
      }
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 创建项目
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const project_create = async (req, res, next) => {
  try {
    let data = await projectServ.setProjectUpsert({
      project: req.getReqParams(),
      user: req.user
    })
    return res.sendResponse({
      data
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 删除项目
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const project_delete = async (req, res, next) => {
  try {
    //请求参数校验规则
    const reqRule = [
      {
        key: 'ids',
        required: true
      }
    ]
    const errors = req.validateReqParams(reqRule)
    if (errors.length > 0) {
      return res.sendError({
        data: errors[0]
      })
    }
    let { ids } = req.getReqParams()
    await projectServ.delProject({ ids })
    return res.sendResponse()
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 根据项目 id 查询项目数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_by_id = async (req, res, next) => {

  try {
    let { projectId } = req.query
    let data = {}
    data = await projectServ.getProjectsById(projectId)
    let projectdatas = await projectServ.getProjectdatasByProjectId(projectId)
    if (projectdatas) {
      data.content = projectdatas.contentData
    } else {
      data.content = '{}'
    }
    return res.sendResponse({
      data
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 编辑项目
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_edit = async (req, res, next) => {
  try {
    let ok = await projectServ.setProjectUpsert(req.body)
    return res.sendResponse({
      data: ok
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 修改发布状态
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_publish = async (req, res, next) => {

  try {
    // "id": "686921059995357184", //项目主键
    // "state": "-1" //项目状态[-1未发布,1发布]
    let { id, state } = req.body
    let ok = await projectServ.project_publish({ id, state })
    return res.sendResponse({
      data: ok
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 * 保存项目数据
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_data_save = async (req, res, next) => {
  try {
    let { projectId, content } = req.body
    let data = await projectServ.project_data_save({ projectId, content })
    return res.sendResponse({
      data
    })
  } catch (error) {
    return res.sendError({
      data: error
    })
  }
}

/**
 *  项目截图上传
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_upload = async (req, res, next) => {

  let uploadDir = SYSTEM.UPLOAD_PATH
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  try {
    let form = new multiparty.Form({
      uploadDir: uploadDir
    })
    form.on('error', function (err) {
      console.log('Error parsing form: ' + err.stack)
    })
    form.parse(req, function (err, fields, files) {
      if (err) {

        return res.sendError({
          data: err,
          msg: '写文件操作失败!'
        })
      } else {
        // let filesTmp = JSON.stringify(files, null, 2)
        // console.log('parse files: ' + filesTmp)
        let file_info = files.object[0]
        let file_size = file_info.size
        let uploadedPath = file_info.path
        let originalFilename = file_info.originalFilename
        let dstPath = path.join(uploadDir, originalFilename)

        File.rename(uploadedPath, dstPath)
          .then(err => {
            if (err) {
              console.log('重命名文件错误：' + err)
            } else {
              console.log('重命名文件成功。')
            }
            let data = {
              id: moment(new Date().getTime()).format('YYYYMMDDhhmmss'),
              fileName: originalFilename,
              bucketName: '',
              fileSize: file_size,
              fileSuffix: '',
              createUserId: '',
              createUserName: '',
              createTime: new Date(),
              updateUserId: '',
              updateUserName: '',
              updateTime: new Date()
            }

            return res.sendResponse({
              data,
              msg: '上传成功！'
            })
          })
          .catch(function (err) {
            console.log('upload failed ', err)
            return res.sendError({
              data: err,
              msg: '上传失败！'
            })
          })
      }
    })
  } catch (error) {
    return res.sendError({
      data: error,
      msg: '上传失败！'
    })
  }
}

/**
 * 获取图片
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const project_get_images = async (req, res, next) => {
  let fileName = req.params.id
  if (!fileName) {
    return res.sendError({
      data: {},
      msg: '请传入 id(文件名)！'
    })
  }
  try {
    let uploadDir = SYSTEM.UPLOAD_PATH
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    let file_path = path.join(uploadDir, fileName)
    let has_file = fs.statSync(file_path).isFile()
    if (!has_file) {
      return res.sendError({
        data: {},
        msg: '文件不存在！'
      })
    }
    // 允许跨域：必须要按照如下设置，否则无法访问到图片
    res.writeHead('200', {
      'Content-Type': 'image/jpeg',
      // 设置允许所有端口访问
      'Access-Control-Allow-Origin': '*',
      // 默认为same-origin，会造成 ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200
      'Cross-Origin-Opener-Policy': 'cross-origin',
      // 默认为same-origin，会造成 ERR_BLOCKED_BY_RESPONSE.NotSameOrigin 200
      'Cross-Origin-Resource-Policy': 'cross-origin'
    })
    var stream = fs.createReadStream(file_path)
    var responseData = [] //存储文件流
    if (stream) {
      //判断状态
      stream.on('data', function (chunk) {
        responseData.push(chunk)
      })
      stream.on('end', function () {
        var finalData = Buffer.concat(responseData)
        res.write(finalData)
        res.end()
      })
    }
  } catch (error) {
    return res.sendError({
      data: error,
    })
  }
}

module.exports = {
  project_list,
  project_by_id,
  project_create,
  project_edit,
  project_delete,
  project_publish,
  project_data_save,
  project_upload,
  project_get_images
}
