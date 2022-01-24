import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	HttpLink,
	ApolloLink,
	Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

import { createTokenStorage } from './utils/accessToken';

import { App } from './App';
import jwtDecode from 'jwt-decode';

const storageToken = createTokenStorage<string>('token');

const requestLink = new ApolloLink(
	(operation, forward) =>
		new Observable(observer => {
			let handle: any;
			Promise.resolve(operation)
				.then(operation => {
					const token = storageToken.getToken();
					if (token) {
						operation.setContext({
							headers: {
								authorization: token ? `Bearer ${token}` : '',
							},
						});
					}
				})
				.then(() => {
					handle = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});
				})
				.catch(observer.error.bind(observer));
			return () => {
				if (handle) handle.unsubscribe();
			};
		})
);

const client = new ApolloClient({
	link: ApolloLink.from([
		new TokenRefreshLink({
			accessTokenField: 'accessToken',
			isTokenValidOrUndefined: () => {
				const token = storageToken.getToken();
				if (!token) {
					return true;
				}
				try {
					const { exp } = jwtDecode<any>(token);
					if (Date.now() >= exp * 1000) {
						return false;
					} else {
						return true;
					}
				} catch {
					return false;
				}
			},
			fetchAccessToken: () => {
				return fetch('http://localhost:5050/refresh_token', {
					method: 'POST',
					credentials: 'include',
				});
			},
			handleFetch: accessToken => {
				storageToken.setToken(accessToken);
			},

			handleError: err => {
				// full control over handling token fetch Error
				console.warn('Your refresh token is invalid. Try to relogin');
				console.log(err);
			},
		}),
		onError(({ graphQLErrors, networkError }) => {
			console.log(graphQLErrors);
			console.log(networkError);
		}),
		requestLink,
		new HttpLink({
			uri: 'http://localhost:5050/graphql',
			credentials: 'include',
		}),
	]),
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ApolloProvider>,
	document.getElementById('root')
);
