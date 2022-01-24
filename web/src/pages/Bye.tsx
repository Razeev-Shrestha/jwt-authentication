import { useByeQuery } from '../generated';
// import { createTokenStorage } from '../utils/accessToken';

export const Bye: React.FC = () => {
	const { data, error, loading } = useByeQuery();

	// const storageToken = createTokenStorage<string>('token');

	if (loading) {
		return <div>loading ...</div>;
	}

	if (error) {
		console.log(error);
		return <div>err</div>;
	}

	if (!data) {
		return <div>no data</div>;
	}

	// storageToken.removeToken();

	return <div>{data.bye}</div>;
};
