import { Navigate, Outlet } from 'react-router-dom';
import localStorageService from '../../network/localStorageService';

import * as Routerpath from '../../RouteConfig';

const ProtectedRoute = () => {
	let token = localStorageService?.getJwtToken();

	return !(token && token !== '') ? (
		<Navigate to={Routerpath.LOGIN} />
	) : (
		<Outlet />
	);
};

export default ProtectedRoute;
