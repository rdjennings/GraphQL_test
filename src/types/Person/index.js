const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql')

const { Post } = require('../Post')

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Represents a person object',
  fields: () => {
    return {
      id: { type: GraphQLInt },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
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
