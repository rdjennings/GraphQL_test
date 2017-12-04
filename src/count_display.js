import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { postIndexFragment } from './types/Post/fragments'

const QUERY_POSTS = gql`
 query allPosts {
 	posts {
	 	id
 	}
 }
`

class Display extends Component {
	render() {
		const { loading, error, posts } = this.props.allPostsQuery
		posts && console.log('Posts from counters:', posts)

		return (
			<span>
				{error && !loading && (
					<span>
						Error: {error.message}
					</span>
				)}
				{!error && loading && (
					<span>
						Loading...
					</span>
				)}

				{!error && !loading && (
					<span>
						Count: {posts.length}
					</span>
				)}
			</span>
		)
	}
}

export default graphql(QUERY_POSTS, {name: 'allPostsQuery'})(Display)
