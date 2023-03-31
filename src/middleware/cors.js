const cors = require('cors')
const { PORT } = require('../config')
const corsOptions = {
  origin: `http://localhost:${PORT}`
}
module.exports = cors(corsOptions)
