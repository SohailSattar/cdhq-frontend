import { Navigate, Outlet } from "react-router-dom";
import localStorageService from "../../network/localStorageService";

import { PrivilegeType } from "../types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../../utils/store";
import * as Routerpath from "../../RouteConfig";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

interface Props {
	projectId?: number;
	privilegeType?: PrivilegeType;
}

const ProtectedRoute: FC<Props> = ({ projectId, privilegeType }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
	const [renderedComponent, setRenderedComponent] =
		useState<React.ReactElement | null>(null);

	// const [];

	let token = localStorageService?.getJwtToken();

	const fetchLoginStatus = useCallback(async () => {
		try {
			const { data } = await checkLoginStatus();
			if (data) {
				setIsLoggedIn(data?.isLoggedIn);
			}
		} catch (error) {
			// Handle errors if needed
		}
	}, []); // Empty dependency array as there are no external dependencies

	useEffect(() => {
		fetchLoginStatus();
	}, [fetchLoginStatus]);

	useEffect(() => {
		if (isLoggedIn !== undefined) {
			if (isLoggedIn) {
				setRenderedComponent(<Outlet />);
			} else {
				setRenderedComponent(<Navigate to={Routerpath.LOGIN} />);
			}
			setIsLoggedIn(isLoggedIn);
		}
	}, [isLoggedIn]);

	return renderedComponent ?? null;
};

export default ProtectedRoute;
