'use strict'

const dayjs = require('dayjs')

const date_fmt = d => {
  d = chgVal(d)
  if (d) return dayjs(d).format('YYYY-MM-DD HH:mm:ss.SSS')
  else return d
}

const isAfter = (d1, d2) => {
  d1 = chgVal(d1)
  d2 = chgVal(d2)
  let res = dayjs(d1).isAfter(d2)
  return res
}

// 增加几天
const addDay = (day, d_num, type = 'add') => {
  if (type == 'add') return date_fmt(dayjs(chgVal(day)).add(d_num, 'day'))
  else return date_fmt(dayjs(chgVal(day)).subtract(d_num, 'day'))
}

// 减少几天
const subtractDay = (day, d_num) => {
  return date_fmt(dayjs(chgVal(day)).subtract(d_num, 'day'))
}

const isBigger = (d1, d2) => {
  let res = isAfter(d1, d2)
  return res
}

const chgVal = d => {
  if (d) {
    // 如果传入的是字符，则转化为dayjs对象
    if (typeof d === 'string' && dayjs(d).isValid()) d = dayjs(d)
  } else {
    // 如果为空，为当前时间
    d = dayjs()
  }
  return d
}

const monthStartEnd = d => {
  let startDate = dayjs(d).startOf('month').format('YYYY-MM-DD')
  let endDate = dayjs(d).endOf('month').format('YYYY-MM-DD')
  return { startDate, endDate }
}

module.exports = {
  date_fmt,
  isAfter,
  isBigger,
  addDay,
  subtractDay,
  chgVal,
  monthStartEnd
}
