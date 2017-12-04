const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList
} = require('graphql')

var Post = new GraphQLObjectType({
	name: 'Post',
	description: 'Represents a post object',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve: (post) => {
					return post.id
				}
			},
			title: {
				type: GraphQLString,
				resolve: (post) => {
					return post.title
				}
			},
			content: {
				type: GraphQLString,
				resolve: (post) => {
					return post.content
				}
			},
			author: {
				type: GraphQLInt,
				resolve: (post) => {
					return post.author
				}
			}
		}
	}
})

module.exports.Post = Post