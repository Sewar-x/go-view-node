/** 
 * =========================================
 * CORS : 跨域资源共享
 * doc: https://www.npmjs.com/package/cors
 * ==========================================
 **/

const cors = require('cors')
const { SYSTEM } = require('@config')
const corsOptions = {
  origin: SYSTEM.CORS_WHITElIST.join()
};

module.exports = cors(corsOptions)
