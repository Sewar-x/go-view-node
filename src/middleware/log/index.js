const logger = require('./log')

module.exports = opts => {
  let loggerMiddleware = logger(opts)
  return async (ctx, next) => {
    return loggerMiddleware(ctx, next).catch(e => {
      if (ctx.status < 500) {
        ctx.status = 500
      }
      ctx.log.error(e.stack)
    })
  }
}
