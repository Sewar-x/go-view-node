'use strict'

const _ = require('lodash')

exports.isEmptyObject = e => {
  var t
  for (t in e) return !1
  return !0
}

// console.log($.isEmptyObject({
//     "re": 2
// })); //false

exports.toXlsList = (rows, hasCols) => {
  hasCols = hasCols || true
  var data = new Array()
  rows.forEach(function(item, index, input) {
    if (index == 0 && hasCols) data.push(Object.keys(item))
    data.push(Object.values(item))
  })
  return data
}

function fixGetValue(obj) {
  return obj ? obj : ''
}

exports.allProps = obj => {
  // 用来保存所有的属性名称和值
  var arr = Object.keys(obj),
    keys = [],
    o = new Object()
  for (var i of arr) {
    if (i != '_csrf') o[i] = obj[i]
  }
  return o
}

exports.getNullObj = (columns, except) => {
  except = except || ['createdAt', 'updatedAt']
  var obj = {}
  columns = _.difference(columns, except)
  for (var i of columns) {
    if (!obj.hasOwnProperty(i)) {
      obj[i] = null
    }
  }
  return obj
}

exports.allProps2 = obj => {
  // 用来保存所有的属性名称和值
  var props = ''
  // 开始遍历
  for (var p in obj) {
    // 方法
    if (typeof obj[p] == ' function ') {
      obj[p]()
    } else {
      // p 为属性名称，obj[p]为对应属性的值
      props += p + ' = ' + obj[p] + ' /t '
    }
  }
  return props
}

/**
 *
 * @desc   判断`obj`是否为空
 * @param  {Object} obj
 * <a href='http://www.jobbole.com/members/wx1409399284'>@return</a> {Boolean}
 */
function isEmptyObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
  return !Object.keys(obj).length
}

/*
 *检测对象是否是空对象(不包含任何可读属性)。
 *方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
 */
exports.isEmpty = obj => {
  for (var name in obj) {
    return false
  }
  return true
}

// var a = {};
// a.name = 'realwall';
// console.log(isEmpty(a)); //false
// console.log(isEmpty({})); //true
// console.log(isEmpty(null)); //true
//注意参数为null时无语法错误哦，即虽然不能对null空指针对象添加属性，但可以使用forin 语句。
/*
 * 检测对象是否是空对象(不包含任何可读属性)。
 * 方法只既检测对象本身的属性，不检测从原型继承的属性。
 */
exports.isOwnEmpty = obj => {
  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}

// // {}与null的区别： 这个东西很重要。
// var a = {};
// var b = null;
// a.name = 'realwall';
// b.name = 'jim';
// //这里会报错，b为空指针对象，不能像普通对象一样直接添加属性。
// b = a;
// b.nameB = 'jim';
// //此时 a 和 b 指向同一个对象。a.name, b.name 均为'jam'

// console.log(isEmptyObject()); //true
// console.log(isEmptyObject({})); //true
// console.log(isEmptyObject(null)); //true
// console.log(isEmptyObject(23)); //true
// console.log(isEmptyObject({
//     "te": 2
// })); //false
