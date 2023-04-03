const express = require('express')
const path = require('path')
const { PUBLICPATH } = require('@config')
module.exports = express.static(path.resolve(__dirname, PUBLICPATH))
