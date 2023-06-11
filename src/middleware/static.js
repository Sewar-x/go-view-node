/**
 * =======================================================================================
 *  静态文件管理
 * =======================================================================================
 */

const express = require('express')
const path = require('path')
const { SYSTEM } = require('@config')
module.exports = express.static(path.resolve(__dirname, SYSTEM.PUBLICPATH))
