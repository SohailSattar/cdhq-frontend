import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import clsx from "clsx";

import { Footer, Loader, NotAuthorized, OffcanvasNavbar } from "..";

import { getMyDetail } from "../../api/users/get/getMyDetail";
import { useStore } from "../../utils/store";
import { APILoggedUser } from "../../api/users/types";
import localStorageService from "../../network/localStorageService";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";
import * as RoutePath from "../../RouteConfig";
import styles from "./styles.module.scss";
import { PrivilegeType } from "../types";

interface Props {
	privilegeType?: PrivilegeType;
	hideLoginButton?: boolean;
	noChecks?: boolean;
	children: any;
	className?: string;
	showQRCodes?: boolean;
	showLinks?: boolean;
	showCounter?: boolean;
}

const Layout: FC<Props> = ({
	privilegeType = "All",
	hideLoginButton = false,
	noChecks = false,
	children,
	className,
	showQRCodes = false,
	showLinks = false,
	showCounter = false,
}) => {
	const navigate = useNavigate();
	const loggedUser: APILoggedUser = useStore((state) => state.loggedInUser);
	const setLoggedUser = useStore((state) => state.setLoggedInUser);
	const [, , removeCookie] = useCookies([
		"id",
		"name",
		"nameEnglish",
		"userName",
		"role",
	]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [content, setContent] = useState<React.ReactNode | undefined>();
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

	const removeLocalStorageData = useCallback(() => {
		localStorageService.clearToken();
	}, []);

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
	}, [clearLoggedInUserState, removeLocalStorageData, removeCookies]);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorageService.getJwtToken();
			if (token && loggedUser.userName === "") {
				const { data: myStatus } = await checkLoginStatus();

				if (myStatus?.isLoggedIn === true) {
					const { data, error } = await getMyDetail();

					if (error && error.response.status === 401) {
						navigate(RoutePath.LOGIN);
					}

					if (data) {
						setLoggedUser(data);
					}
				}
			} else if (!token && !noChecks) {
				navigate(RoutePath.ROOT);
			}
		};

		fetchUserData();
	}, [loggedUser.userName, navigate, noChecks, setLoggedUser]);

	const fetchData = useCallback(async () => {
		try {
			const { data } = await checkLoginStatus();

			if (data?.isLoggedIn) {
				setCanView(true);
			} else if (data?.isLoggedIn === false) {
				setCanView(false);
			}
		} catch (error) {
			// Handle error
		}
	}, []);

	const fetchContent = useCallback(() => {
		if (canView === undefined) {
			setContent(<Loader />);
		} else if (canView === false) {
			setContent(<NotAuthorized />);
		} else {
			setContent(children);
		}
	}, [canView, children]);

	const fetch = useCallback(async () => {
		try {
			setIsLoading(true); // Set loading state to true before fetching data
			await fetchData();
			fetchContent();
		} catch (error) {
			// Handle error
		} finally {
			setIsLoading(false); // Set loading state to false after fetching, whether successful or not
		}
	}, [fetchData, fetchContent]);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const ErrorFallback = useCallback(({ error, resetErrorBoundary }: any) => {
		return (
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{error.message}</pre>
				<button onClick={resetErrorBoundary}>Try again</button>
			</div>
		);
	}, []);

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
					<div>
						<br />
						<br />
					</div>
					<Footer
						showQRCodes={showQRCodes}
						showLinks={showLinks}
						showCounter={showCounter}
					/>
				</ErrorBoundary>
			)}
		</>
	);
};

export default React.memo(Layout);
