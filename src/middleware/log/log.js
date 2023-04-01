/**
 * log4j文档：https://github.com/stritti/log4js
 */

const log4js = require('log4js')
const access = require('./access') // 引入日志输出信息的封装文件
const config = require('../../configure/index.js')
const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'] //日志分级

// 提取默认公用参数对象
const baseInfo = config.log
module.exports = (options = {}) => {
  let contextLogger = {}, //错误日志等级对象，最后会赋值给ctx上，用于打印各种日志
    appenders = {}, //日志配置
    opts = Object.assign({}, baseInfo, options), //系统配置
    { logLevel, dir, ip, projectName } = opts,
    commonInfo = { projectName, ip } //存储公用的日志信息

  //指定要记录的日志分类
  appenders.all = {
    type: 'dateFile', //日志文件类型，可以使用日期作为文件名的占位符
    filename: `${dir}/all/`, //日志文件名，可以设置相对路径或绝对路径
    pattern: 'task-yyyy-MM-dd.log', //占位符，紧跟在filename后面
    alwaysIncludePattern: true //是否总是有后缀名
  }

  // 环境变量为dev、development 认为是开发环境，如果为开发环境配置在控制台上打印信息
  // if (config.env === "dev"  || config.env === "development") {
  //     appenders.out = {
  //         type: "console"
  //     };
  // }

  let logConfig = {
    appenders,

    /**
     * 指定日志的默认配置项
     * 如果 log4js.getLogger 中没有指定，默认为 cheese 日志的配置项
     */
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: logLevel //日志等级
      }
    }
  }

  let logger = log4js.getLogger('cheese')
  return async (ctx, next) => {
    const start = Date.now() // 记录请求开始的时间
    // 循环methods将所有方法挂载到ctx 上
    methods.forEach(method => {
      contextLogger[method] = message => {
        logConfig.appenders.cheese = {
          type: 'dateFile', //日志文件类型，可以使用日期作为文件名的占位符
          filename: `${dir}/${method}/`,
          pattern: `${method}-yyyy-MM-dd.log`,
          alwaysIncludePattern: true //是否总是有后缀名
        }
        log4js.configure(logConfig) //使用配置项
        logger[method](access(ctx, message, commonInfo))
      }
    })
    ctx.log = contextLogger
    // 执行中间件
    await next()
    // 记录完成的时间 作差 计算响应时间
    const responseTime = Date.now() - start

    ctx.log.info(
      access(
        ctx,
        {
          responseTime: `响应时间为${responseTime / 1000}s`
        },
        commonInfo
      )
    )
  }
}
