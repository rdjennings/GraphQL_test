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
  render () {
    const { loading, error, posts } = this.props.allPostsQuery
    // posts && console.log('Posts from counters:', posts)

    if (loading) {
      return (
        <span>
          Loading...
        </span>
      )
    }
    if (error && error !== undefined) {
      return (
        <span>
          Error: {error.message}
        </span>
      )
    }
    return (
      <span>
          Count: {posts ? posts.length : 0}
      </span>
    )
  }
}

export default compose(
  graphql(QUERY_POSTS, {name: 'allPostsQuery'})
)(Display)
