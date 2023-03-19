// 部分保留
exports.checkParams = (params, keys) => {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      throw new Error('Parameter missed: ' + key)
    }
  }
}

exports.getBaseUrl = originalUrl => {
  return originalUrl.substr(0, originalUrl.indexOf('?'))
}

// // 获取url中的参数
// exports.GetQueryStringRegExp = (name, url) => {
//   var reg = new RegExp('(^|?|&)' + name + '=([^&]*)(s|&|$)', 'i')
//   if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/+/g, ' '))
//   return ''
// }

function respond(res, tpl, obj, status) {
  res.format({
    html: () => res.render(tpl, obj),
    json: () => {
      if (status) return res.status(status).json(obj)
      res.json(obj)
    }
  })
}

function respondOrRedirect({ req, res }, url = '/', obj = {}, flash) {
  res.format({
    html: () => {
      if (req && flash) req.flash(flash.type, flash.text)
      res.redirect(url)
    },
    json: () => res.json(obj)
  })
}

/* 获得当前浏览器JS的版本 */
function getjsversion() {
  var n = navigator
  var u = n.userAgent
  var apn = n.appName
  var v = n.appVersion
  var ie = v.indexOf('MSIE ')
  if (ie > 0) {
    apv = parseInt((i = v.substring(ie + 5)))
    if (apv > 3) {
      apv = parseFloat(i)
    }
  } else {
    apv = parseFloat(v)
  }
  var isie = apn == 'Microsoft Internet Explorer'
  var ismac = u.indexOf('Mac') >= 0
  var javascriptVersion = '1.0'
  if (String && String.prototype) {
    javascriptVersion = '1.1'
    if (javascriptVersion.match) {
      javascriptVersion = '1.2'
      var tm = new Date()
      if (tm.setUTCDate) {
        javascriptVersion = '1.3'
        if (isie && ismac && apv >= 5) javascriptVersion = '1.4'
        var pn = 0
        if (pn.toPrecision) {
          javascriptVersion = '1.5'
          a = new Array()
          if (a.forEach) {
            javascriptVersion = '1.6'
            i = 0
            o = new Object()
            tcf = new Function('o', 'var e,i=0;try{i=new Iterator(o)}catch(e){}return i')
            i = tcf(o)
            if (i && i.next) {
              javascriptVersion = '1.7'
            }
          }
        }
      }
    }
  }
  return javascriptVersion
}
// /* 手机类型判断 */
// var BrowserInfo = {
// 	userAgent: navigator.userAgent.toLowerCase()
// 	isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
// 	isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
// 	isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
// 	isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
// }
