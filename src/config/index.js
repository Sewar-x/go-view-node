'use strict'


const Path = require('path')
const { getFiles } = require('@utils/File.js')


const env = process.env.NODE_ENV || 'development'
const getJsFiles = ({ path, filename, content }) => {
  let extname = Path.extname(filename)
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

console.log('==configure==', configure)
global.config = configure
module.exports = configure
