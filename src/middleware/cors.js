/** 
 * CORS : 跨域资源共享
 * doc: https://www.npmjs.com/package/cors
 **/
const cors = require('cors')
const { PORT } = require('../config')
const corsOptions = {
  //可以从 http://localhost 访问该API，并禁止其他域使用
  origin: `http://localhost:${PORT}`
}
module.exports = cors(corsOptions)