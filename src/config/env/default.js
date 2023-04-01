'use strict'
const fs = require('fs')
const path = require('path')

/**
 * 同步获取 config 文件夹下所有文件配置
 * @returns
 */
function getFilesFromFold() {
  let configure = {}
  const modules = []
  try {
    const files = fs.readdirSync(path.join(__dirname, '../'))
    files.forEach(file => {
      let extname = path.extname(file)
      if (extname === '.js') {
        const filePath = path.join(path.join(__dirname, '../'), file)
        modules.push(require(filePath))
      }
    })

    modules.forEach(m => {
      configure = { ...configure, ...m }
    })
    return configure
  } catch (error) {
    return {}
  }
}

module.exports = getFilesFromFold()
