import { Link } from 'react-router-dom';
import { useLogoutMutation, useMeQuery } from '../generated';
import { createTokenStorage } from '../utils/accessToken';
export const Header: React.FC = () => {
	const { data, loading } = useMeQuery();
	const [logout, { client }] = useLogoutMutation();

	const storageToken = createTokenStorage<string>('token');

	let body: any = null;

	if (loading) {
		body = null;
	} else if (data && data.me) {
		body = <div> you are logged in as :{data.me.email}</div>;
	} else {
		body = <div>not logged in </div>;
	}

	return (
		<div>
			<header>
				<Link to='/'>Home</Link>
				<Link to='/login'>Login</Link>
				<Link to='/register'>Register</Link>
				<Link to='/bye'>Bye</Link>
				{!loading && data && data.me ? (
					<button
						onClick={async () => {
							await logout();
							storageToken.removeToken();
							await client!.resetStore();
						}}>
						Logout
					</button>
				) : null}
			</header>
			{body}
		</div>
	);
};
