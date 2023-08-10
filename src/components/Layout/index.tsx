import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { Footer, Header, Loader, Loading, NotAuthorized } from "..";
import { getMyDetail } from "../../api/users/get/getMyDetail";
import { useStore } from "../../utils/store";
import { getMyRole } from "../../api/users/get/getMyRole";
import { APILoggedUser } from "../../api/users/types";
import { getProjectPrivilege } from "../../api/userProjects/get/getProjectPrivilege";

import localStorageService from "../../network/localStorageService";

import { PrivilegeType } from "../types";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { Id } from "../../utils";

interface Props {
	projectId?: number;
	privilegeType?: PrivilegeType;
	hideLoginButton?: boolean;
	noChecks?: boolean;
	children: any;
}

const Layout: FC<Props> = ({
	projectId,
	privilegeType = "All",
	hideLoginButton = false,
	noChecks = false,
	children,
}) => {
	const navigate = useNavigate();

	const loggedUser: APILoggedUser = useStore(
		(state: { loggedInUser: any }) => state.loggedInUser
	);
	const setLoggedUser = useStore((state) => state.setLoggedInUser);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [content, setContent] = useState<any>();
	const [canView, setCanView] = useState<boolean>();

	const fetchProjectPrivilege = useMemo(
		() => async (id: Id) => {
			setIsLoading(true);
			const { data: privilege } = await getProjectPrivilege(id!);

			switch (privilegeType) {
				case "All":
					setCanView(true);
					break;
				case "Read":
					setCanView(privilege?.readPrivilege!);
					break;
				case "Write":
					setCanView(privilege?.insertPrivilege!);
					break;
				case "Update":
					setCanView(privilege?.updatePrivilege!);
					break;
				case "None":
					setCanView(false);
					break;
			}

			setIsLoading(false);
		},
		[privilegeType]
	);

	const fetchContent = useCallback(async () => {
		setIsLoading(true);
		const token = localStorageService.getJwtToken();
		if (token) {
			const { data: myRole } = await getMyRole();
			const role = myRole?.role.name!;

			if (role !== loggedUser?.role!) {
				setLoggedUser({ ...loggedUser, role: role });
			}

			if (loggedUser.userName === "") {
				const { data, error } = await getMyDetail();
				if (error) {
					if (error.response.status === 401) {
						navigate(RoutePath.LOGIN);
					}
				}
				if (data) {
					setLoggedUser(data);
				}
			}
		} else {
			if (!noChecks) {
				navigate(RoutePath.ROOT);
			}
		}
		// console.log(canView);
		if (canView === false) {
			setContent(<NotAuthorized />);
		} else {
			setContent(children);
		}
		setIsLoading(false);
	}, [canView, children, loggedUser, navigate, noChecks, setLoggedUser]);

	// const fetchContent = useMemo(
	// 	() => async () => {
	// 		setIsLoading(true);
	// 		const token = localStorageService.getJwtToken();
	// 		if (token) {
	// 			const { data: myRole } = await getMyRole();
	// 			const role = myRole?.role.name!;

	// 			if (role !== loggedUser?.role!) {
	// 				setLoggedUser({ ...loggedUser, role: role });
	// 			}

	// 			if (loggedUser.userName === "") {
	// 				const { data, error } = await getMyDetail();
	// 				if (error) {
	// 					if (error.response.status === 401) {
	// 						navigate(RoutePath.LOGIN);
	// 					}
	// 				}
	// 				if (data) {
	// 					setLoggedUser(data);
	// 				}
	// 			}
	// 		} else {
	// 			navigate(RoutePath.ROOT);
	// 		}
	// 		// console.log(canView);
	// 		if (!canView) {
	// 			setContent(<NotAuthorized />);
	// 		} else {
	// 			setContent(children);
	// 		}

	// 		setIsLoading(false);
	// 	},
	// 	[canView, children, loggedUser, navigate, setLoggedUser]
	// );

	useEffect(() => {
		if (projectId) {
			fetchProjectPrivilege(projectId);
		} else {
			setCanView(true);
			setIsLoading(true);
		}
		fetchContent();
	}, [fetchContent, fetchProjectPrivilege, projectId]);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setIsLoading(true);
	// 		const token = localStorageService.getJwtToken();
	// 		if (token) {
	// 			const { data: myRole } = await getMyRole();
	// 			const role = myRole?.role.name!;

	// 			if (role !== loggedUser?.role!) {
	// 				setLoggedUser({ ...loggedUser, role: role });
	// 			}

	// 			if (loggedUser.userName === "") {
	// 				const { data, error } = await getMyDetail();
	// 				if (error) {
	// 					if (error.response.status === 401) {
	// 						navigate(RoutePath.LOGIN);
	// 					}
	// 				}
	// 				if (data) {
	// 					setLoggedUser(data);
	// 				}
	// 			}
	// 		} else {
	// 			navigate(RoutePath.ROOT);
	// 		}

	// 		if (canView) {
	// 			console.log("xxx");
	// 			setContent(<NotAuthorized />);
	// 		} else {
	// 			console.log("ccc");
	// 			setContent(children);
	// 		}

	// 		setIsLoading(false);
	// 	};

	// 	console.log(isLoading);
	// 	fetchData();
	// }, [
	// 	loggedUser,
	// 	navigate,
	// 	setLoggedUser,
	// 	setIsLoading,
	// 	isLoading,
	// 	canView,
	// 	children,
	// ]);

	const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
		return (
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{error.message}</pre>
				<button onClick={resetErrorBoundary}>Try again</button>
			</div>
		);
	};

	return (
		<>
			{!loggedUser ? (
				<Loading />
			) : (
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						// reset the state of your app so the error doesn't happen again
					}}>
					<Header hideLoginButton={hideLoginButton} />
					<div className={styles.layout}>
						{isLoading ? <Loading /> : content}
					</div>
					<div>
						<br />
						<br />
					</div>
					<Footer />
				</ErrorBoundary>
			)}
		</>
	);
};

export default Layout;
