const path = require('path')
const moduleAlias = require('module-alias')

// 定义设置 require 文件路径别名的函数
module.exports = (() => {
  const alias = {
    '@models': '../modules',
    '@config': '../config',
    '@controllers': '../controllers',
    '@middleware': '../middleware',
    '@plugins': '../plugins',
    '@routers': '../routers',
    '@utils': '../utils',
    '@services': '../services',
    '@package': '../../package.json'
  }

  for (let name in alias) {
    alias[name] = path.join(__dirname, alias[name])
  }
  moduleAlias.addAliases(alias)
  moduleAlias()
})()
