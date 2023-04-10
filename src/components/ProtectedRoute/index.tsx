import { Navigate, Outlet } from "react-router-dom";
import localStorageService from "../../network/localStorageService";

import * as Routerpath from "../../RouteConfig";
import { PrivilegeType } from "../types";
import { FC } from "react";

interface Props {
	projectId?: number;
	privilegeType?: PrivilegeType;
}

const ProtectedRoute: FC<Props> = ({ projectId, privilegeType }) => {
	let token = localStorageService?.getJwtToken();

	return !(token && token !== "") ? (
		<Navigate to={Routerpath.LOGIN} />
	) : (
		<Outlet />
	);
};

export default ProtectedRoute;
