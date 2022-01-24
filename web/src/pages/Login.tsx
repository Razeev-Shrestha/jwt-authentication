import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeDocument, MeQuery, useLoginMutation } from '../generated';
import { createTokenStorage } from '../utils/accessToken';

interface Props {}

export const LoginPage: React.FC<Props> = () => {
	type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const [login] = useLoginMutation();

	const storageToken = createTokenStorage<string>('token');

	const handleFormSubmit = async (e: any) => {
		e.preventDefault();
		console.log('Form Submitted');
		console.log(email, password);

		const response = await login({
			variables: {
				email,
				password,
			},
			update: (store, { data }) => {
				if (!data) {
					return null;
				}
				store.writeQuery<MeQuery>({
					query: MeDocument,
					data: {
						__typename: 'Query',
						me: data.login.user,
					},
				});
			},
		});
		console.log(response);

		if (response && response.data) {
			storageToken.setToken(response.data.login.accessToken);
		}

		navigate('/');
	};

	return (
		<form onSubmit={handleFormSubmit}>
			<div>
				<input
					value={email}
					placeholder='Enter Your Email'
					required
					onChange={(e: ChangeEvent) => setEmail(e.target.value)}
				/>
			</div>
			<div>
				<input
					value={password}
					type='password'
					placeholder='Enter Your Passsword'
					required
					onChange={(e: ChangeEvent) => setPassword(e.target.value)}
				/>
			</div>
			<button type='submit'>Login</button>
		</form>
	);
};
