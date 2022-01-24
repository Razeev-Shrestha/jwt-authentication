import { useState } from 'react';
import { useRegisterMutation } from '../generated';
import { useNavigate } from 'react-router-dom';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export const RegisterPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const [register] = useRegisterMutation();

	const handleFormSubmit = async (e: any) => {
		e.preventDefault();
		console.log('Form Submitted');
		console.log(email, password);

		const response = await register({
			variables: {
				email,
				password,
			},
		});
		console.log(response);
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
			<button type='submit'>Register</button>
		</form>
	);
};
