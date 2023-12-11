import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import {
	Footer,
	Header,
	Loader,
	Loading,
	NotAuthorized,
	OffcanvasNavbar,
} from "..";
import { getMyDetail } from "../../api/users/get/getMyDetail";
import { useStore } from "../../utils/store";
// import { getMyRole } from "../../api/users/get/getMyRole";
import { APILoggedUser } from "../../api/users/types";
import { getProjectPrivilege } from "../../api/userProjects/get/getProjectPrivilege";

import localStorageService from "../../network/localStorageService";

import { PrivilegeType } from "../types";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { Id } from "../../utils";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";
import { useCookies } from "react-cookie";
import { boolean } from "yargs";
import clsx from "clsx";
import React from "react";

interface Props {
	// projectId?: number;
	privilegeType?: PrivilegeType;
	hideLoginButton?: boolean;
	noChecks?: boolean;
	children: any;
	className?: string;
	showQRCodes?: boolean;
	showLinks?: boolean;
	showCounter?: boolean;
	defaultPosition?: boolean;
}

const Layout: FC<Props> = ({
	// projectId,
	privilegeType = "All",
	hideLoginButton = false,
	noChecks = false,
	children,
	className,
	showQRCodes = false,
	showLinks = false,
	showCounter = false,
	defaultPosition = false,
}) => {
	const navigate = useNavigate();

	const loggedUser: APILoggedUser = useStore(
		(state: { loggedInUser: any }) => state.loggedInUser
	);
	const setLoggedUser = useStore((state) => state.setLoggedInUser);
	const [, , removeCookie] = useCookies([
		"id",
		"name",
		"nameEnglish",
		"userName",
		"role",
	]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [content, setContent] = useState<any>();
	const [canView, setCanView] = useState<boolean>();

	const clearLoggedInUserState = useCallback(() => {
		setLoggedUser({
			id: 0,
			userName: "",
			name: "",
			nameEnglish: "",
			role: "",
		});
	}, [setLoggedUser]);

	const removeLocalStorageData = () => {
		localStorageService.clearToken();
	};

	const removeCookies = useCallback(() => {
		removeCookie("id", { path: "/" });
		removeCookie("name", { path: "/" });
		removeCookie("nameEnglish", { path: "/" });
		removeCookie("userName", { path: "/" });
		removeCookie("role", { path: "/" });
	}, [removeCookie]);

	const removeLocalData = useCallback(() => {
		clearLoggedInUserState();
		removeLocalStorageData();
		removeCookies();
	}, [clearLoggedInUserState, removeCookies]);

	useEffect(() => {
		const fetch = async () => {
			const token = localStorageService.getJwtToken();
			if (token) {
				// const { data: myStatus } = await checkLoginStatus();
				// const role = myStatus?.role!;
				// if (role !== loggedUser?.role!) {
				// 	setLoggedUser({ ...loggedUser, role: role });
				// }
				if (loggedUser.userName === "") {
					const { data: myStatus } = await checkLoginStatus();

					if (myStatus?.isLoggedIn === true) {
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
					// else {
					// 	navigate(RoutePath.LOGIN);
					// }
				}
			} else {
				if (!noChecks) {
					navigate(RoutePath.ROOT);
				}
			}
		};

		fetch();
	}, [loggedUser, navigate, noChecks, setLoggedUser]);

	// const fetch = useMemo(
	// 	() => async () => {
	// 		try {
	// 			const { data } = await checkLoginStatus();
	// 			if (data?.isLoggedIn) {
	// 				// if (projectId) {
	// 				// 	await fetchProjectPrivilege(projectId);
	// 				// } else {
	// 				setCanView(true);
	// 				setIsLoading(true);
	// 				// }
	// 				// await fetchContent();

	// 				///////////////////////////// fetch Content

	// 				if (canView === undefined) {
	// 					setContent(<Loader />);
	// 				}

	// 				if (canView === false) {
	// 					setContent(<NotAuthorized />);
	// 				} else {
	// 					setContent(children);
	// 				}
	// 				setIsLoading(false);

	// 				//////////////////////////////
	// 			} else {
	// 				if (data?.isLoggedIn === false) {
	// 					setContent(children);
	// 					if (loggedUser.id !== 0) {
	// 						removeLocalData();
	// 					}
	// 					// navigate(RoutePath.LOGIN);
	// 				}
	// 			}
	// 		} catch (error) {
	// 			// Handle error
	// 		}
	// 		console.log("xd");
	// 	},
	// 	[canView, children, loggedUser.id, removeLocalData] // , loggedUser.id, navigate, removeLocalData
	// );

	const fetch = useCallback(async () => {
		try {
			const { data } = await checkLoginStatus();
			if (data?.isLoggedIn) {
				// if (projectId) {
				//   await fetchProjectPrivilege(projectId);
				// } else {
				setCanView(true);
				setIsLoading(true);
				// }
				// await fetchContent();

				///////////////////////////// fetch Content

				if (canView === undefined) {
					setContent(<Loader />);
				}

				if (canView === false) {
					setContent(<NotAuthorized />);
				} else {
					setContent(children);
				}
				setIsLoading(false);

				//////////////////////////////
			} else {
				if (data?.isLoggedIn === false) {
					setContent(children);
					if (loggedUser.id !== 0) {
						removeLocalData();
					}
					// navigate(RoutePath.LOGIN);
				}
			}
		} catch (error) {
			// Handle error
		}
	}, [
		canView,
		children,
		loggedUser.id,
		removeLocalData,
		setIsLoading,
		setContent,
	]);

	// useEffect(() => {
	// 	fetch();
	// }, [fetch]);

	const memoizedFetch = useMemo(() => fetch, [fetch]);

	useEffect(() => {
		memoizedFetch();
	}, [memoizedFetch]);

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

	const ErrorFallback = useMemo(
		() =>
			({ error, resetErrorBoundary }: any) => {
				return (
					<div role="alert">
						<p>Something went wrong:</p>
						<pre>{error.message}</pre>
						<button onClick={resetErrorBoundary}>Try again</button>
					</div>
				);
			},
		[]
	);

	// console.log(content);

	return (
		<>
			{!loggedUser ? (
				<Loader />
			) : (
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						// reset the state of your app so the error doesn't happen again
					}}>
					{/* <Header hideLoginButton={hideLoginButton} /> */}
					<OffcanvasNavbar hideLoginButton={hideLoginButton} />
					<div className={clsx(styles.layout, className)}>
						{isLoading ? (
							<Loader />
						) : content === undefined ? (
							<Loader />
						) : (
							content
						)}
					</div>
					{!defaultPosition && (
						<div>
							<br />
							<br />
						</div>
					)}
					<Footer
						showQRCodes={showQRCodes}
						showLinks={showLinks}
						showCounter={showCounter}
						counter={{ count: 0 }}
					/>
				</ErrorBoundary>
			)}
		</>
	);
};

export default React.memo(Layout);
