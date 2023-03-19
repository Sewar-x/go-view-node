const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('./models')

const app = express()
const PORT = process.env.PORT || 4444

var corsOptions = {
  origin: `http://localhost:${PORT}`
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to led application.' })
})

const routes = require('./routers')
app.use(routes)

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
