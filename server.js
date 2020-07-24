const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const studentApi = require('./components/student/router')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }))

app.get('/health', api.getHealth)
app.use(studentApi)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
