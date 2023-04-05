/**
 * 文件路径解析中间件，将文件路径转为对象
 * 将 controllers 中的文件位置映射为应用对象
 */

const Path = require('path')
const fs = require('fs')

const getFiles = (path, content, onlyIndexFiles) => {
  //readdirSync: 方法将返回一个包含“指定目录下所有文件名称”的数组对象。
  //extname: 返回path路径文件扩展名，如果path以 ‘.' 为结尾，将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
  //basename: path.basename(p, [ext]) p->要处理的path ext->要过滤的字符
  fs.readdirSync(path).forEach(filename => {
    const statPath = Path.join(path, filename)
    const stats = fs.statSync(statPath) // fs.stat 方法来获取文件或文件夹的信息

    //判断是否为文件夹，文件夹递归获取 js 文件
    return stats.isDirectory() ? getFiles(statPath, content, onlyIndexFiles) : getJsFiles(path, filename, content, onlyIndexFiles)
  })
}

const getJsFiles = (path, filename, content, onlyIndexFiles) => {
  let extname = Path.extname(filename)
  let name = Path.basename(filename, extname)

  if (extname === '.js') {
    if (name === 'index' && onlyIndexFiles) {
      let folderName = Path.basename(path, extname)
      content[folderName] = require(Path.join(path, filename))
      content[folderName].filename = folderName
    } else {
      content[name] = require(Path.join(path, name))
      content[name].filename = name
    }
  }
  return content
}

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
      getFiles(path, content, onlyIndexFiles)
      app[name] = content
    })
  }
}
