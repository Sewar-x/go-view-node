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
    return res.sendResponse({
      data: {
        bucketURL: oosurl,
        BucketName: OSS_BUCKETNAME
      }
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
