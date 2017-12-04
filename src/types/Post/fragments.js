const gql = require('graphql-tag')

var exports = module.exports = {}

const postDataFragment = gql`
	fragment postData on Post {
		title
		content
	}
`

const postIndexFragment = gql`
	fragment postIndex on Post {
		id
		author
	}
`

exports.postDataFragment = postDataFragment
exports.postIndexFragment = postIndexFragment
