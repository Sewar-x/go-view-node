'use strict'
const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const Knex = require('knex')
// 用于处理分页
const { attachPaginate } = require('knex-paginate')

class DB {
  //构造函数
  constructor({ database, sequelizeConfig, knexConfig, logging, DEBUG = true }) {
    //创建一个sequelize实例
    this.sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig.connect, {
      // 控制台输出查询日志
      logging: logging.info,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    this.tabs = []
    this.models = {}
    this.dbType = database.DATABASE
    this.dbName = database.DB_NAME
    this.knex = Knex(knexConfig)
    attachPaginate()
  }

  async loadModel(_path) {
    fs.readdirSync(_path) //读取当前文件夹的文件
      .filter(file => {
        //过滤掉index.js，因为index.js就是这份代码
        let fix = file.substring(file.lastIndexOf('.'), file.length) //后缀名
        // logging.info(file, fix);
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

  // 一次同步所有模型,同步表结构,Sequelize 自动对数据库执行 SQL 查询.(请注意,这仅更改数据库中的表,而不更改 JavaScript 端的模型) 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
  async sync() {
    this.sequelize.sync({
      // force: true //将创建表,如果表已经存在,则将其首先删除
      // alter: true // - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
    })
  }
}

module.exports = (sequelizeConfig, logging = false) => {
  let _db = new DB(sequelizeConfig, logging)
  return _db
}
