const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList
} = require('graphql')

const { Post } = require('../Post')

var Person = new GraphQLObjectType({
	name: 'Person',
	description: 'Represents a person object',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve: (person) => {
					return person.id
				}
			},
			firstName: {
				type: GraphQLString,
				resolve: (person) => {
					return person.firstName
				}
			},
			lastName: {
				type: GraphQLString,
				resolve: (person) => {
					return person.lastName
				}
			},
			email: {
				type: GraphQLString,
				resolve: (person) => {
					return person.email
				}
			},
			posts: {
				type: new GraphQLList(Post),
				resolve: (person, args, { db }) => {
					return db.queryAsync(`select * from Post where author = ${person.id}`).then(rows => rows)
				}
			}
		}
	}
})

module.exports.Person = Person