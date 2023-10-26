/** 
 * =========================================
 * CORS : 跨域资源共享
 * doc: https://www.npmjs.com/package/cors
 * ==========================================
 **/

const cors = require('cors')
const { SYSTEM } = require('@config')
const corsOptions = {
  //可以从 http://localhost 访问该API，并禁止其他域使用
  origin:function (origin, callback) {
    if (SYSTEM.CORS_WHITElIST.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  } 
}
module.exports = cors(corsOptions)
