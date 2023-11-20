const { SYSTEM } = require('@config')

/**
 * 获取文件上传oss信息
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getOssInfo = async (req, res, next) => {
  try {
    // 注意：服务端部署服务中使用了 nginx 代理，因此实际部署服务 host 与代理不一定相同，因此需要通过配置方式 
    // let host = req.get('host')
    const host = `${SYSTEM.OSS_HOST}:${SYSTEM.OSS_PORT}`
    let ishttps = req.secure
    let http = ishttps ? 'https' : 'http'
    let oosurl = http + '://' + host + SYSTEM.OOS_PATH
    return res.sendResponse({
      data: {
        bucketURL: oosurl,
        BucketName: SYSTEM.OSS_BUCKETNAME
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
