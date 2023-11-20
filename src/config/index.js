'use strict'


const Path = require('path')
const { getFiles } = require('@utils/File.js')


const env = process.env.NODE_ENV || 'development'
const getJsFiles = ({ path, filename, content }) => {
  // 获取文件扩展名
  let extname = Path.extname(filename)
  // 获取文件名
  let name = Path.basename(filename, extname)
  if(name === env) {
    let folderName = Path.basename(path, extname)
    content[folderName.toUpperCase()] = require(Path.join(path, filename))
    content[folderName.toUpperCase()].filename = folderName
  }
  return content
}

const configure = {}
getFiles({
  path: Path.join(__dirname, '.'),
  content: configure,
  getFilesCallBack: getJsFiles
})

global.config = configure
module.exports = configure
