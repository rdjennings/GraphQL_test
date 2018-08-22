const Express = require('express')
const GraphHTTP = require('express-graphql')
const Schema = require('./schema')
const Bluebird = require('bluebird')
const cors = require('cors')

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'graphql_test'
})

connection.connect((err) => {
  if (err) {
    /* eslint-disable */
    console.log(`Caught err: ${err}`)
    /* eslint-enable */
    throw err
  }
  /* eslint-disable */
  console.log('You are now connected ...')
  /* eslint-enable */
  const db = Bluebird.promisifyAll(connection)

  app.use(cors())
  app.use('/graphql', GraphHTTP({
    schema: Schema,
    context: { db },
    graphiql: true
  }))
})

const APP_PORT = 3020

const app = Express()

const server = app.listen(APP_PORT, () => {
  /* eslint-disable */
  console.log(`App listening on port ${APP_PORT}`)
  /* eslint-enable */
})

server.timeout = 0
