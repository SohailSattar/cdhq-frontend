import { Navigate, Outlet } from "react-router-dom";
import localStorageService from "../../network/localStorageService";

import { PrivilegeType } from "../types";
import { FC, useCallback, useEffect, useState } from "react";
import { useStore } from "../../utils/store";
import * as Routerpath from "../../RouteConfig";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

interface Props {
	projectId?: number;
	privilegeType?: PrivilegeType;
}

const ProtectedRoute: FC<Props> = ({ projectId, privilegeType }) => {
	const [isLoggedin, setIsLoggedIn] = useState<boolean>();
	let token = localStorageService?.getJwtToken();

	const checkLogin = useCallback(async () => {
		const { data } = await checkLoginStatus();
		if (data) {
			setIsLoggedIn(data?.isLoggedIn);
		}
	}, []);

	useEffect(() => {
		checkLogin();
	}, [checkLogin]);

	console.log("token", token);
	console.log("!(token && token !== )", !(token && token !== ""));
	console.log("isLoggedin !== true", isLoggedin !== true);
	console.log(
		"!(token && token !== ) && isLoggedin !== true",
		!(token && token !== "") && isLoggedin !== true
	);

	return isLoggedin !== true ? <Navigate to={Routerpath.LOGIN} /> : <Outlet />;
};

export default ProtectedRoute;
