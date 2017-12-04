var Express = require('express');
var GraphHTTP = require('express-graphql');
var Schema = require('./schema')
var Bluebird = require('bluebird')
var cors = require('cors')

var mysql = require('mysql')

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'graphql_test'
})

connection.connect(function(err) {
	if (err) throw err
	console.log('You are now connected ...')
	var db = Bluebird.promisifyAll(connection)

	app.use(cors())
	app.use('/graphql', GraphHTTP({
		schema: Schema,
		context: { db },
		graphiql: true
	}))

})

const APP_PORT = 3020;

const app = Express();

app.listen(APP_PORT, () => {
	console.log(`App listening on port ${APP_PORT}`)
})