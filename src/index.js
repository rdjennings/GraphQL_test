import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import App from './App'

const client = new ApolloClient({
	link: new HttpLink({uri: 'http://localhost:3020/graphql'}),
	cache: new InMemoryCache({
		dataIdFromObject: object => {
			console.log('OID', object.__typename + '_' + object.id)
			return object.__typename + '_' + object.id
		}
	})
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
)