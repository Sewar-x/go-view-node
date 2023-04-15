'use strict'
const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')

class DB {
  //构造函数
  constructor({ database, sequelizeConfig, knexConfig, logging, DEBUG = true }) {
    //创建一个sequelize实例
    this.sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig.connect, {
      // 控制台输出查询日志
      logging: logging.info,
      // 事务隔离级别：可串行化(Serializable)
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    this.tabs = []
    this.models = {}
    this.dbType = database.DATABASE
    this.dbName = database.DB_NAME
  }

  /**
   * 加载指定路径下的所有模型，如果没有传入 路径，默认加载 models 路径下的模型
   * @param {*} _path
   * @returns
   */
  loadModel(_path) {
    try {
      // 获取 Models 的路径
      const folderPath = _path || path.join(__dirname, '../../models')
      // 获取models 下的文件夹和文件
      const modelsFolder = fs.readdirSync(folderPath)
      if (!modelsFolder || modelsFolder.length === 0) return false
      //过滤出 models 下的文件夹
      const folders = modelsFolder.filter(file => {
        //过滤掉index.js，因为index.js就是这份代码
        let fix = file.substring(file.lastIndexOf('.'), file.length) //后缀名
        return fix.indexOf('.') !== 0 && file !== 'index.js' && fix !== '.js'
      })
      folders.forEach(foldersName => {
        this.loadModelFiles(folderPath, foldersName)
      })
    } catch (err) {
      console.log(err)
    }

    return this.modelAssociate()
  }

  /**
   * 加载指定文件夹下的所有模型文件
   * @param {*} parentFolder model 下文件夹
   * @param {*} foldersName model 的文件夹目录名称
   */
  loadModelFiles(parentFolder, foldersName) {
    // 获取 models 文件夹下的文件夹路径
    const chilFolderPath = path.join(parentFolder, foldersName)
    const folderFiles = fs.readdirSync(chilFolderPath)
    folderFiles.forEach(fileName => {
      //import的方式创建model，并把它存储到db这个对象中
      const modelsFile = require(path.join(chilFolderPath, fileName))
      let model = modelsFile(this.sequelize, DataTypes) // 6.x 版本写法
      this.models[model.name] = model
      this.tabs.push(model.name)
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
    return _models
  }

  async hasConection() {
    try {
      return await sequelize.authenticate()
    } catch (error) {
      console.error('connect to db error ', error)
      return false
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

module.exports = DB
