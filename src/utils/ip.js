getClientIp = (request, res, next) => {
  return (
    request.headers['x-forwarded-for'] ||
    (request.connection && request.connection.remoteAddress) ||
    request.socket.remoteAddress ||
    (request.connection.socket && request.connection.socket.remoteAddress) ||
    null
  )
}

module.exports = [getClientIp]
