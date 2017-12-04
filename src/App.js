import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { postDataFragment, postIndexFragment } from './types/Post/fragments'

import CountDisplay from './count_display'

const QUERY_POSTS = gql`
 query allPosts {
 	posts {
	 	...postIndex
	 	...postData
 	}
 }
 ${postIndexFragment}
 ${postDataFragment}
`

const CREATE_POST = gql`
	mutation addPost($id: Int!, $title: String!, $content: String!, $author: Int!) {
		addPost(id: $id, title: $title, content: $content, author: $author) {
			...postIndex
		}
	}
 	${postIndexFragment}
`

const UPDATE_POST = gql`
	mutation updatePost($id: Int!, $title: String!, $content: String!, $author: Int!) {
		updatePost(id: $id, title: $title, content: $content, author: $author) {
			...postIndex
		}
	}
 	${postIndexFragment}
`

const DELETE_POST = gql`
	mutation deletePost($id: Int!) {
		deletePost(id: $id) {
			id
		}
	}
`

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			addUpdate: ''
		}
	}
	addPost() {
		this.props.addPostMutation({
			variables: {
				id: 4,
				title: 'A new post from React',
				content: 'Content from A new post from React',
				author: 1
			},
 			refetchQueries: [{query: QUERY_POSTS}]
		}).then(() => this.setState({addUpdate: 'added'}))
	}

	updatePost() {
		this.props.updatePostMutation({
			variables: {
				id: 4,
				title: 'An updated post from React',
				content: 'Content from An updated post from React',
				author: 1
			},
 			refetchQueries: [{query: QUERY_POSTS}]
		}).then(() => this.setState({addUpdate: 'updated'}))
	}

	deletePost() {
		this.props.deletePostMutation({
			variables: {
				id: 4
			},
 			refetchQueries: [{query: QUERY_POSTS}]
		}).then(() => this.setState({addUpdate: ''}))
	}

	render () {
		const { loading, error, posts } = this.props.allPostsQuery
		posts && console.log('Posts from "App":', posts)

		console.log(this.props)

		let handleClick
		let label
		switch (this.state.addUpdate) {
			case '':
				handleClick = this.addPost.bind(this);
				label = 'Add';
				break;
			case 'added':
				handleClick = this.updatePost.bind(this);
				label = 'Update';
				break;
			case 'updated':
				handleClick = this.deletePost.bind(this);
				label = 'Delete';
				break;
			default:
				label = '';
				handleClick = () => {}
		}


		return (
			<div>
				{loading && (
					<div>
						Loading...
					</div>
				)}

				{error && (
					<div>
						Error: {error.message}
					</div>
				)}

				{!loading && !error && 
					(
						<div>
							<ul>
								{posts.map((post, idx) => {
									return (
										<li key={idx}>
											{post.id}: {post.title}
										</li>
									
									)
								})}
							</ul>
							<div>
								<button onClick={handleClick}>{label}</button>
							</div>
							<p>
								<CountDisplay />
							</p>
						</div>
					)
				}
			</div>
		)
	}

}

export default compose(
	graphql(QUERY_POSTS, {name: 'allPostsQuery'}),
	graphql(CREATE_POST, {name: 'addPostMutation'}),
	graphql(UPDATE_POST, {name: 'updatePostMutation'}),
	graphql(DELETE_POST, {name: 'deletePostMutation'})
)(App)
