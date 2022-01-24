import {
	Routes as Switch,
	BrowserRouter as Router,
	Route,
	RouteProps,
} from 'react-router-dom';
import { Header } from './components';
import { Bye, HomePage, LoginPage, RegisterPage } from './pages';

const allRoutes: RouteProps[] = [
	{ path: '/', element: <HomePage /> },
	{ path: '/login', element: <LoginPage /> },
	{ path: '/register', element: <RegisterPage /> },
	{ path: '/bye', element: <Bye /> },
];
export const Routes: React.FC = () => {
	return (
		<Router>
			<Header />
			<Switch>
				{allRoutes.map((routes, idx: number) => (
					<Route key={idx} {...routes} />
				))}
			</Switch>
		</Router>
	);
};
