/**
 * 文件路径解析中间件，将文件路径转为对象，将文件内容挂载到 app 实例对象，便于获取文件上下文
 * 将 controllers 中的文件位置映射为应用对象
 */
const Path = require('path')
const { getFiles } = require('../utils/File.js')
module.exports = (app, options = {}) => {
  const { rules = [] } = options
  const defaultRules = [
    {
      // 获取控制器下所有文件
      path: Path.join(__dirname, '../controllers'),
      name: 'controllers',
      onlyIndexFiles: true, // 是否仅仅识别 index.js 文件
      content: {}
    },
    {
      // 获取路由下所有文件
      path: Path.join(__dirname, '../routers/modules'),
      name: 'routers',
      onlyIndexFiles: false,
      content: {}
    }
  ]
  if (!app) {
    throw new Error('the app params is necessary!')
  }
  rulesArray = [...rules, ...defaultRules]
  const appKeys = Object.keys(app)
  if (rulesArray.length > 0) {
    rulesArray.forEach(item => {
      let { path, name, content, onlyIndexFiles } = item
      if (appKeys.includes(name)) {
        throw new Error(`the name of ${name} already exists!`)
      }
      getFiles({ path, content, onlyIndexFiles })
      app[name] = content
    })
  }
}
