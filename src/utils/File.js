'use strict'

var fs = require('fs')
const Path = require('path')

/**
 * 获取指定文件路径下的所有文件
 * @param {*} path 文件夹路径
 * @param {*} content 文件内容
 * @param {*} onlyIndexFiles 是否仅仅获取 index 文件
 * @param {*} filesName 获取指定文件名
 * @param {*} filesNametoUpperCase
 */
const getFiles = ({ path, content, onlyIndexFiles, filesName = null, filesNametoUpperCase = false, getFilesCallBack = null }) => {
  //readdirSync: 方法将返回一个包含“指定目录下所有文件名称”的数组对象。
  //extname: 返回path路径文件扩展名，如果path以 ‘.' 为结尾，将返回 ‘.'，如果无扩展名 又 不以'.'结尾，将返回空值。
  //basename: path.basename(p, [ext]) p->要处理的path ext->要过滤的字符
  fs.readdirSync(path).forEach(filename => {
    const statPath = Path.join(path, filename)
    const stats = fs.statSync(statPath) // fs.stat 方法来获取文件或文件夹的信息

    //判断是否为文件夹，文件夹递归获取 js 文件
    const getJsFilesMethod = getFilesCallBack ? getFilesCallBack : getJsFiles
    return stats.isDirectory() ? getFiles({ path: statPath, content, onlyIndexFiles, filesName, filesNametoUpperCase, getFilesCallBack }) : getJsFilesMethod({ path, filename, content, onlyIndexFiles, filesName, filesNametoUpperCase })

  })
}

/**
 * 获取路径下js文件
 * @param {*} param0 
 * @returns 
 */
const getJsFiles = ({ path, filename, content, onlyIndexFiles, filesName = null, filesNametoUpperCase = false }) => {
  let extname = Path.extname(filename)
  let name = Path.basename(filename, extname)

  if (extname === '.js') {
    // 仅仅获取 index 文件 
    if (name === 'index' && onlyIndexFiles) {
      let folderName = Path.basename(path, extname)
      content[folderName] = require(Path.join(path, filename))
      content[folderName].filename = folderName
    }
    // 获取指定文件名
    if (filesName && filesName === name) {
      content[name] = require(Path.join(path, name))
      content[name].filename = name
    }
    // 获取非 index 文件
    if (!onlyIndexFiles && !filesName) {
      content[name] = require(Path.join(path, name))
      content[name].filename = name
    }
  }
  return content
}

/**
 * 文件重命名
 * @param {*} _old 
 * @param {*} _new 
 * @returns 
 */
const rename = (_old, _new) => {
  return new Promise((resolve, reject) => {
    fs.rename(_old, _new, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}


module.exports = {
  getFiles,
  getJsFiles,
  rename
}