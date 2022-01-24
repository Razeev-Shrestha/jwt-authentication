import { useUsersQuery } from '../generated';

interface Props {}

export const HomePage: React.FC<Props> = () => {
	const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' });

	if (loading || !data) {
		return <div>Loading...</div>;
	}
	return (
		<div>
			<h2>Users:</h2>
			{data.users.map(({ id, email }) => {
				return <li key={id}>{email}</li>;
			})}
		</div>
	);
};
