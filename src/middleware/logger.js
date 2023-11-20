/**
 * =======================================================================================
 *  日志管理中间件
 * =======================================================================================
 */

const log4js = require('log4js')
const { LOG, SYSTEM } = require('@config/index.js')
const { red } = require('color-name')
// 日志配置
log4js.configure({
  PM2: SYSTEM.USE_PM2,
  // 定义日志各种分类执行的事件
  appenders: {
    error: {
      // 错误日志
      type: 'dateFile',
      filename: `${LOG.LOG_CONFIG.dir}/error/error`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: { type: "coloured" }
    },
    info: {
      // 普通日志
      type: 'dateFile',
      filename: `${LOG.LOG_CONFIG.dir}/info/info`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: { type: "coloured" } // 输出带颜色的日志信息
    },
    debug: {
      // 调试日志
      type: 'dateFile',
      filename: `${LOG.LOG_CONFIG.dir}/debug/info`,
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: { type: "coloured" } // 输出带颜色的日志信息
    },
  },
  //指定要记录的日志分类
  categories: {
    error: {
      appenders: ['error'],
      level: 'error'
    },
    info: {
      appenders: ['info'],
      level: 'info'
    },
    debug: {
      appenders: ['debug'],
      level: 'debug'
    },
    default: {
      //默认日志
      appenders: ['info'],
      level: 'info'
    }
  }
})

// 创建日志记录器
const errorLogger = log4js.getLogger('error')
const infoLogger = log4js.getLogger('info')
const debugLogger = log4js.getLogger('debug')
// 定义 middleware 函数
const loggerMiddleware = (req, res, next) => {
  // 保存当前时间
  const now = new Date()

  // 定义日志信息对象
  const logInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    referer: req.headers['referer'], // 请求的源地址
    userAgent: req.headers['user-agent'], // 客户端信息 设备及浏览器信息
    body: req.body,
    query: req.query,
    params: req.params,
    timestamp: now.toISOString(),
    responseTime: null
  }

  // 将日志信息对象添加到响应对象中,在响应结束时可以获取到日志信息并记录日志
  res.logInfo = logInfo

  // 定义错误处理函数
  const errorHandler = err => {
    // 将错误信息添加到日志信息对象中
    logInfo.error = err.message

    // 根据错误类型选择日志记录器
    if (err instanceof Error) {
      errorLogger.error(logInfo)
    } else {
      infoLogger.info(logInfo)
    }
  }

  // 定义响应处理函数
  const responseHandler = () => {
    // 记录完成的时间 作差计算响应时间
    logInfo.responseTime = `${Date.now() - now} ms`
    // 根据响应状态选择日志记录器
    if (res.statusCode >= 400) {
      errorLogger.error(logInfo)
    } else {
      infoLogger.info(logInfo)
    }
  }

  // 在响应结束时记录日志
  res.on('finish', responseHandler)

  // 在发生错误时记录日志
  res.on('error', errorHandler)
  res.log = log
  next()
}

// 输出存储信息函数
const log = (errorType, message) => {
  // 根据错误类型选择日志记录器
  const logMap = {
    'error': errorLogger,
    'info': infoLogger,
    'debug': debugLogger
  }
  logger = logMap[errorType] || infoLogger
  logger[errorType](message)
}

// 导出模块
module.exports = {
  loggerMiddleware,
  log
}
