import React, { Component } from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { postDataFragment, postIndexFragment } from './types/Post/fragments'

import CountDisplay from './count_display'

const updatedTitle = 'An updated post from React'
const updatedContent = 'Content from An updated post from React'

const newTitle = 'A new post from React'
const newContent = 'Content from A new post from React'

const fields = `
  id
  author
`

const QUERY_POSTS = gql`
 query allPosts {
   posts {
     ${fields}
     ...postData
   }
 }
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
      ...postData
    }
  }
   ${postIndexFragment}
  ${postDataFragment}
`

const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addUpdate: ''
    }
  }
  componentDidMount () {
    // this.props.allPostsQuery.startPolling(5000)
  }

  addPost () {
    this.props.addPostMutation({
      variables: {
        id: 4,
        title: newTitle,
        content: newContent,
        author: 1
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addPost: {
          id: 4,
          title: newTitle,
          content: newContent,
          author: 1,
          __typename: 'Post'
        }
      },
      update: (store, { data: { updatePost } }) => {
        const data = store.readQuery({
          query: QUERY_POSTS
        })
        data.posts.push({
          title: newTitle,
          content: newContent,
          author: 1,
          id: -1,
          __typename: 'Post'
        })
        store.writeQuery({
          query: QUERY_POSTS,
          data
        })
      },
      refetchQueries: [{query: QUERY_POSTS}]
    }).then(() => { return this.setState({addUpdate: 'added'}) })
  }

  updatePost () {
    this.props.updatePostMutation({
      variables: {
        id: 4,
        title: updatedTitle,
        content: updatedContent,
        author: 1
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePost: {
          id: 4,
          title: 'temp title',
          content: 'tempt comtent',
          author: 1,
          __typename: 'Post'
        }
      }
    }).then(() => { return this.setState({addUpdate: 'updated'}) })
  }

  deletePost () {
    this.props.deletePostMutation({
      variables: {
        id: 4
      },
      optimisticResponse: {
        __typename: 'Mutation',
        deletePost: {
          id: 4,
          title: null,
          content: null,
          author: null,
          __typename: 'Post'
        }
      },
      update: (store, { data: { updatePost } }) => {
        const data = store.readQuery({
          query: QUERY_POSTS
        })
        data.posts.splice(3, 1)
        store.writeQuery({
          query: QUERY_POSTS,
          data
        })
      },
      refetchQueries: [{query: QUERY_POSTS}]
    }).then(() => { return this.setState({addUpdate: ''}) })
  }

  render () {
    const { loading, error, posts } = this.props.allPostsQuery
    // posts && console.log('Posts from "App":', posts)

    let test = 'nada'

    try {
      test = this.props.client.readFragment({
        id: 'Post_3',
        fragment: gql`
          fragment post on Post {
            title
            author
            __typename
          }
        `
      })
    } catch (err) {
      test = null
      console.log('no cache entry')
    }

    // console.log('Cache results:', test)

    posts && (
      this.props.client.writeFragment({
        id: 'Test:4',
        fragment: gql`
          fragment test on Test {
            id
            title
            author
            content
            __typename
          }`,
        data: {
          id: 4,
          title: 'Cache title',
          content: 'Cache content',
          author: 1,
          __typename: 'Test'
        }
      })
    )

    let handleClick
    let label
    switch (this.state.addUpdate) {
      case '':
        handleClick = this.addPost.bind(this)
        label = 'Add'
        break
      case 'added':
        handleClick = this.updatePost.bind(this)
        label = 'Update'
        break
      case 'updated':
        handleClick = this.deletePost.bind(this)
        label = 'Delete'
        break
      default:
        label = ''
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
  withApollo,
  graphql(QUERY_POSTS, {name: 'allPostsQuery'}),
  graphql(CREATE_POST, {name: 'addPostMutation'}),
  graphql(UPDATE_POST, {name: 'updatePostMutation'}),
  graphql(DELETE_POST, {name: 'deletePostMutation'})
)(App)
