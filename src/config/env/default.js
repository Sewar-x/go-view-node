'use strict'
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, '../'), (err, files) => {
  if (err) {
    return false
  }
  files.forEach(file => {
    let extname = path.extname(file)
    if (extname === '.js') {
      const filePath = path.join(path.join(__dirname, '../'), file)
      modules.push(require(filePath))
    }
  })
  let configure = {}
  modules.forEach(m => {
    configure = { ...configure, ...m }
  })
})

const app = require('../app.js')
const database = require('../database.js')
const system = require('../system.js')
const log = require('../log.js')
const token = require('../token.js')
let config = {
  ...app,
  ...system,
  ...log,
  ...token,
  //数据库配置
  database: database.default.db,
  // sequelize 配置
  sequelizeConfig: database.default.sequelize
}

module.exports = config
