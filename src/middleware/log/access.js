/*
    设置需要日志需要记录的信息段
*/
module.exports = (res, msg, commonInfo) => {
  const {
    method, // 请求方法 get post或其他
    url, // 请求链接
    hostname, // 发送请求的客户端的host
    headers // 请求中的headers
  } = res
  const client = {
    method,
    url,
    hostname,
    msg,
    referer: headers['referer'], // 请求的源地址
    userAgent: headers['user-agent'] // 客户端信息 设备及浏览器信息
  }
  return JSON.stringify(Object.assign(commonInfo, client))
}
