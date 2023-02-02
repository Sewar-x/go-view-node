'use strict'

var fs = require('fs')

exports.rename = (_old, _new) => {
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
