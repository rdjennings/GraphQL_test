const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql')

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Represents a post object',
  fields: () => {
    return {
      id: { type: GraphQLInt },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      author: { type: GraphQLInt }
    }
  }
})

module.exports.Post = Post