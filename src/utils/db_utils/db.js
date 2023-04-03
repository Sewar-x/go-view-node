'use strict'
const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const Knex = require('knex')
// 用于管理数据库 查询数据库，查询表结构，主外键等信息
// const { SchemaInspector } = require('../knex-schema-inspector')
// 用于处理分页
const { attachPaginate } = require('knex-paginate')

// const cls = require('continuation-local-storage')
// // https://itbilu.com/nodejs/npm/EJO6CcCM-.html#usage-manage
// const namespace = cls.createNamespace('zl_green')
// Sequelize.cls = namespace

class DB {
  constructor(db_cfg, logger, debug = true) {
    //创建一个sequelize实例
    this.sequelize = new Sequelize(db_cfg.database, db_cfg.username, db_cfg.password, db_cfg.connect, {
      // https://stackoverflow.com/questions/21427501/how-can-i-see-the-sql-generated-by-sequelize-js
      logging: logger.info,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
      // Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED // "READ UNCOMMITTED"
      // Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED // "READ COMMITTED"
      // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ  // "REPEATABLE READ"
      // Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE // "SERIALIZABLE"
      // logging: log => {
      //   console.log('dbLog: ', log)
      //   return false
      // } // 执行过程会打印一些sql的log，设为false就不会显示
    })
    this.tabs = []
    this.models = {}
    this.dbType = this.sequelize.options.dialect
    this.dbName = this.sequelize.config.database || db_cfg.database
    this.knex = null
    this.init(db_cfg, debug)
    // this.knex_kit = SchemaInspector(this.knex)
  }

  init(db_cfg, _debug) {
    let dialect = this.dbType
    let knex_options = {
      client: '',
      connection: { timezone: '+08:00', useNullAsDefault: true },
      debug: _debug,
      log: {
        debug(msg) {
          //
          if (msg) {
            let { sql, bindings } = msg
            if (!sql) return
            if (bindings) {
              if (bindings.length == 0) logger.info(`【knex ${dialect}】` + sql)
              else logger.info(`【knex ${dialect}】` + sql, `[ ${bindings.join(', ')} ]`)
            } else {
              logger.info(`【knex ${dialect}】` + sql)
            }
          }
        }
      }
    }

    switch (dialect) {
      case 'mysql':
        knex_options.client = 'mysql2'
        knex_options.connection = {
          host: db_cfg.connect.host,
          port: db_cfg.connect.port,
          user: db_cfg.username,
          password: db_cfg.password,
          database: db_cfg.database,
          timezone: db_cfg.connect.timezone,
          // 方法一
          dateStrings: true
          // 方法二
          // typeCast: function (field, next) {
          //   if (field.type == 'DATETIME') {
          //     return moment(field.string()).format('YYYY-MM-DD HH:mm:ss')
          //   }
          //   return next()
          // }
          // charset: db_cfg.connect.charset
        }
        break

      case 'mssql':
        knex_options.client = dialect
        knex_options.connection = {
          // 此处是server 不是host
          server: db_cfg.connect.host,
          port: db_cfg.connect.port,
          user: db_cfg.username,
          password: db_cfg.password,
          database: db_cfg.database
          // charset: db_cfg.connect.charset
        }
        break

      case 'sqlite':
        knex_options.client = 'sqlite3'
        knex_options.connection = { filename: db_cfg.connect.storage }
        break
      default:
        break
    }
    let knex = Knex(knex_options)
    attachPaginate()
    this.knex = knex
  }

  async loadModel(_path) {
    fs.readdirSync(_path) //读取当前文件夹的文件
      .filter(file => {
        //过滤掉index.js，因为index.js就是这份代码
        let fix = file.substring(file.lastIndexOf('.'), file.length) //后缀名
        // logger.info(file, fix);
        return file.indexOf('.') !== 0 && file !== 'index.js' && fix == '.js'
      })
      .forEach(file => {
        //import的方式创建model，并把它存储到db这个对象中
        // let model = this.sequelize.import(path.join(_path, file)) // 5.x 版本写法
        let model = require(path.join(_path, file))(this.sequelize, DataTypes) // 6.x 版本写法
        this.models[model.name] = model
        this.tabs.push(model.name)
      })
  }

  async loadModelList(_path_list) {
    _path_list.forEach(_path => {
      this.loadModel(_path)
    })
  }

  // 加载所有模型后调用 associate 方法以避免依赖性问题
  async modelAssociate() {
    let _models = this.models
    Object.keys(_models).forEach(function (modelName) {
      if ('associate' in _models[modelName]) {
        _models[modelName].associate(_models)
      }
    })
    this.models = _models
  }

  async hasConection() {
    try {
      await sequelize.authenticate()
      console.log('connect to db ok!')
    } catch (error) {
      console.error('connect to db error ', error)
    }
  }

  // 同步表结构,Sequelize 自动对数据库执行 SQL 查询.(请注意,这仅更改数据库中的表,而不更改 JavaScript 端的模型) 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
  async sync() {
    this.sequelize.sync({
      // force: true
    })
  }
}

module.exports = (db_cfg, logger = false) => {
  let _db = new DB(db_cfg, logger)
  return _db
}
