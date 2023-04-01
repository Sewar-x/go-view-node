'use strict'

const { sessionExpiresIn, APP_SECRET, UPLOAD_PATH } = require('../config')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty')
const moment = require('moment')
const { pf_user } = db
const srv_led = require('../services/srv_led')
const File = require('../utils/File')
const token_kit = require('../utils/token_kit')(sessionExpiresIn, APP_SECRET)

const getOssInfo = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '', data: {} }
  try {
    let host = req.get('host')
    let ishttps = req.secure
    let http = ishttps ? 'https' : 'http'
    let oosurl = http + '://' + host + '/api/goview/project/getImages/'
    let ossInfo = { bucketURL: oosurl, BucketName: 'getuserphoto' }
    res_data.data = ossInfo
    res_data.msg = '返回成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

const login = async (req, res, next) => {
  console.log('🚀 ~ file: led.js:86 ~ login ~ req:', req)

  let res_data = { code: 0, msg: '', data: {} }
  try {
    let { username, password } = req.body
    let user = await pf_user.findOne({ where: { username: username }, raw: true })
    if (!user) {
      res_data.code = 200
      res_data.msg = `未找到对应的用户${username}，请核查！`
      return res.json(res_data)
    }
    // //密码验证
    // let ok = await pf_user.validatePassword(password)
    // if (!ok) {
    //   res_data.code = 200
    //   res_data.msg = `用户${username}登录密码密码不正确，请核查！`
    //   return res.json(res_data)
    // }

    let token = await token_kit.createToken(user)
    let userinfo = {
      id: user.id,
      username: user.username,
      password: '',
      nickname: user.nick,
      depId: '',
      posId: '',
      depName: '',
      posName: ''
    }
    // JWT有效期(分钟=默认120),
    let ExpMinutes = 120
    let _token = {
      tokenName: 'Authorization',
      tokenValue: 'Bearer ' + token,
      isLogin: true,
      loginId: user.id,
      loginType: 'login',
      tokenTimeout: ExpMinutes * 60 * 1000,
      sessionTimeout: ExpMinutes * 60 * 1000,
      tokenSessionTimeout: ExpMinutes * 60 * 1000,
      tokenActivityTimeout: ExpMinutes * 60 * 1000,
      loginDevice: '',
      tag: null
    }
    let userData = { token: _token, userinfo: userinfo }
    res_data.data = userData
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

const logout = async (req, res, next) => {
  return res.json({ msg: '退出成功', code: 200 })
}

const project_list = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, data: [], count: 0, msg: '' }
  try {
    let { page, limit } = req.query
    let { data, count } = await srv_led.project_list({ page, limit })
    res_data.data = data
    res_data.count = count
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

const project_by_id = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, data: {}, msg: '' }
  try {
    let { projectId } = req.query
    let data = {}
    data = await srv_led.getProjectsById(projectId)
    let projectdatas = await srv_led.getProjectdatasByProjectId(projectId)
    if (projectdatas) {
      data.content = projectdatas.contentData
    } else {
      data.content = '{}'
      // res_data.code = 200
      // res_data.msg = '未找到子表数据'
    }
    res_data.data = data
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

const project_create = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '', data: {} }
  try {
    // "indexImage": "测试项目2", //图片地址
    // "projectName": "测试项目2", //项目名称
    // "remarks": "测试项目2" //项目简介
    let { indexImage, projectName, remarks } = req.body
    let data = await srv_led.project_upsert(req.body)
    res_data.data = data
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

// 修改项目
const project_edit = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '' }
  try {
    // "id": "686921059995357184", //项目主键
    // "indexImage": "测试项目2", //图片地址
    // "projectName": "测试项目2", //项目名称
    // "remarks": "测试项目2" //项目简介
    let { id, indexImage, projectName, remarks } = req.body
    let ok = await srv_led.project_upsert(req.body)

    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

// 删除项目
const project_delete = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '' }
  try {
    let { ids } = req.query
    console.log('project_delete ids: ', ids)
    let ok = await srv_led.project_delete(ids)
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

// 修改发布状态
const project_publish = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '' }
  try {
    // "id": "686921059995357184", //项目主键
    // "state": "-1" //项目状态[-1未发布,1发布]
    let { id, state } = req.body

    let ok = await srv_led.project_publish({ id, state })
    res_data.msg = '操作成功'
    res_data.code = 200
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

// 保存项目数据
const project_data_save = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '', data: {} }
  try {
    // projectId 687926057864663040
    // content 1111
    let { projectId, content } = req.body
    let data = await srv_led.project_data_save({ projectId, content })
    res_data.msg = '操作成功'
    res_data.code = 200
    res_data.data = data
  } catch (error) {
    console.log('error: ', error)
    res_data.code = 500
    res_data.msg = error
  }
  return res.json(res_data)
}

// 项目截图上传
const project_upload = async (req, res, next) => {
  let _m = req.method
  let res_data = { code: 0, msg: '', data: {} }
  let uploadDir = UPLOAD_PATH
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
        console.log('parse error: ' + err)
        res_data.code = 500
        res_data.msg = '写文件操作失败。'
        return res.json(res_data)
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
            res_data.code = 200
            res_data.data = data
            res_data.msg = '上传成功！'
            return res.json(res_data)
          })
          .catch(function (err) {
            console.log('upload failed ', err)
            res_data.code = 500
            res_data.msg = '上传失败！'
            return res.json(res_data)
          })
      }
    })
  } catch (error) {
    res_data.code = 500
    res_data.msg = error
    return res.json(res_data)
  }
}

// 获取图片
const project_get_images = async (req, res, next) => {
  let res_data = { code: 0, msg: '', data: {} }
  let fileName = req.params.id
  if (!fileName) {
    res_data.code = 500
    res_data.msg = '前端传给过来的id(文件名)为空！'
    return res.json(res_data)
  }
  try {
    let uploadDir = UPLOAD_PATH
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    let file_path = path.join(uploadDir, fileName)
    let has_file = fs.statSync(file_path).isFile()
    if (!has_file) {
      res_data.code = 500
      res_data.msg = '文件不存在！'
      return res.json(res_data)
    }
    // 必须要按照如下设置，否则goview无法访问到图片
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
    res_data.code = 500
    res_data.msg = error
    return res.json(res_data)
  }
}

module.exports = {
  getOssInfo,
  login,
  logout,
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
