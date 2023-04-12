const { OOS_PATH, OSS_BUCKETNAME } = require('@config')

/**
 * 获取文件上传oss信息
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getOssInfo = async (req, res, next) => {
  try {
    let host = req.get('host')
    let ishttps = req.secure
    let http = ishttps ? 'https' : 'http'
    let oosurl = http + '://' + host + OOS_PATH
    let ossInfo = { bucketURL: oosurl, BucketName: OSS_BUCKETNAME }
    return res.sendError({
      code: 200,
      msg: '该用户已存在！',
      data: ossInfo
    })
  } catch (error) {
    res.sendError({
      code: 500,
      msg: '系统错误',
      data: error
    })
  }
}

module.exports = {
  getOssInfo
}
