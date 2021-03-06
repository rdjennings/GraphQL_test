const { addMockFunctionsToSchema, MockList } = require('graphql-tools')
const casual = require('casual')

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull
} = require('graphql')

const { Person, Post } = require('./src/types')

const QueryType = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		people: {
			type: new GraphQLList(Person),
			resolve: (root, args, { db }) => {
				return db.queryAsync('select * from Person').then(rows => rows)
			}
		},
		person: {
			type: Person,
			args: {
				id: {type: GraphQLInt}
			},
			resolve: (root, args, { db }) => {
				return db.queryAsync(`select * from Person where id = ${args.id}`).then(rows => rows[0])
			}
		},
		post: {
			type: Post,
			args: {
				author: {type: GraphQLInt}
			},
			resolve: (_, args, { db }) => {
				return db.queryAsync(`select * from Post where author = ${args.author}`).then(rows => rows[0])
			}
		},
		posts: {
			type: new GraphQLList(Post),
			resolve: (_, args, { db }) => {
				return db.queryAsync('select * from Post').then(rows => rows)
			}
		}
	}
})

const MutationType = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'These are the things we can change',
  fields: {
    deletePost: {
      type: Post,
      description: 'Delete a post with id and return the article that was deleted.',
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
			resolve: (_, args, { db }) => {
				return db.queryAsync(`delete from Post where id = ${args.id}`)
  			.then(() => {
  				let i
  				let j = 0
  				for (i = 0; i < 1000000000; i++) {
  					j++
  				}
  				return args
  			})
			}
    },
    addPost: {
    	type: Post,
    	description: 'Add a post',
    	args: {
    		id: { type: new GraphQLNonNull(GraphQLInt) },
    		title: { type: new GraphQLNonNull(GraphQLString) },
    		content: { type: new GraphQLNonNull(GraphQLString) },
    		author: { type: new GraphQLNonNull(GraphQLInt)}
    	},
    	resolve: (root, args, { db }) => {
    		return db.queryAsync(`insert into Post values ('${args.id}', '${args.title}', '${args.content}', '${args.author}')`)
    			.then(() => {
    				let i
    				let j = 0
    				for (i = 0; i < 1000000000; i++) {
    					j++
    				}
    				return args
    			})
    	}
    },
    updatePost: {
    	type: Post,
    	description: 'Update a post',
    	args: {
    		id: { type: new GraphQLNonNull(GraphQLInt) },
    		title: { type: new GraphQLNonNull(GraphQLString) },
    		content: { type: new GraphQLNonNull(GraphQLString) },
    		author: { type: new GraphQLNonNull(GraphQLInt)}
    	},
    	resolve: (root, args, { db }) => {
    		return db.queryAsync(`update Post set title = '${args.title}', content = '${args.content}', author = '${args.author}' where id = '${args.id}'`)
    			.then(() => args)
    	}
    }
  }
});

const schema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
})

/* addMockFunctionsToSchema({schema, mocks: {
	Int: () => casual.integer(1, 10),
	String: () => casual.string,
	Post: () => ({
		id: casual.integer(1, 100),
		author: casual.integer(1, 2)
	}),
	Person: () => ({
		id: casual.integer,
		firstName: casual.first_name,
		lastName: casual.last_name,
		email: casual.email,
		posts: () => new MockList([2, 5])
	}),
	RootQuery: () => ({
		posts: () => new MockList(5),
		people: () =>  new MockList([2, 5])
	})
}, preserveResolvers: true}) */

module.exports = schema;
