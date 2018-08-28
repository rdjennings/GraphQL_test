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
    /* eslint-disable-next-line */
    console.log(`Caught err: ${err}`)
    throw err
  }
  /* eslint-disable-next-line */
  console.log('You are now connected ...')
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
  /* eslint-disable-next-line */
  console.log(`App listening on port ${APP_PORT}`)
})

server.timeout = 0
