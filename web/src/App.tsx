import { useEffect, useState } from 'react';
import { Routes } from './Routes';
import { createTokenStorage } from './utils/accessToken';

export const App: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const storageToken = createTokenStorage<string>('token');

	useEffect(() => {
		fetch('http://localhost:5050/refresh_token', {
			method: 'POST',
			credentials: 'include',
		}).then(async x => {
			const { accessToken } = await x.json();
			storageToken.setToken(accessToken);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return <div>loading...</div>;
	}

	return <Routes />;
};
