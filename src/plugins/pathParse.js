/**
 * 文件路径解析中间件，将文件路径转为对象
 * 将 controllers 中的文件位置映射为应用对象
 */

const Path = require('path')
const fs = require('fs')

const getFiles = (path, content) => {
  //readdirSync: 方法将返回一个包含“指定目录下所有文件名称”的数组对象。
  //extname: 返回path路径文件扩展名，如果path以 ‘.' 为结尾，将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
  //basename: path.basename(p, [ext]) p->要处理的path ext->要过滤的字符
  fs.readdirSync(path).forEach(filename => {
    const statPath = `${path}/${filename}`
    const stats = fs.statSync(statPath) // fs.stat 方法来获取文件或文件夹的信息

    //判断是否为文件夹，文件夹递归获取 js 文件
    return stats.isDirectory() ? getFiles(statPath, content) : getJsFiles(path, filename, content)
  })
}

const getJsFiles = (path, filename, content) => {
  let extname = Path.extname(filename)
  let name = Path.basename(filename, extname)

  if (extname === '.js') {
    if (name === 'index') {
      let folderName = Path.basename(path, extname)
      content[folderName] = require(Path.join(path, filename))
      content[folderName].filename = folderName
    } 
  }
  return content
}

module.exports = (app, options = {}) => {
  const { rules = [] } = options
  const defaultRules = [
    {
      path: Path.join(__dirname, '../controllers'),
      name: 'controllers'
    }
  ]
  if (!app) {
    throw new Error('the app params is necessary!')
  }
  rulesArray = [...rules, ...defaultRules]
  app.router = {}
  const appKeys = Object.keys(app)
  if (rulesArray.length > 0) {
    rulesArray.forEach(item => {
      let { path, name } = item
      if (appKeys.includes(name)) {
        throw new Error(`the name of ${name} already exists!`)
      }
      const content = {}
      getFiles(path, content)
      app[name] = content
      console.log("🚀 ~ file: pathParse.js:62 ~ app:", app)
    })
  }
}
