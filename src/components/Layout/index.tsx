import { FC, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { Footer, Header, Loader, NotAuthorized } from "..";
import { getMyDetail } from "../../api/users/get/getMyDetail";
import { useStore } from "../../utils/store";
import { getMyRole } from "../../api/users/get/getMyRole";
import { APILoggedUser } from "../../api/users/types";
import { getProjectPrivilege } from "../../api/userProjects/get/getProjectPrivilege";

import { PrivilegeType } from "../types";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";

interface Props {
	projectId?: number;
	privilegeType?: PrivilegeType;
	children: any;
}

const Layout: FC<Props> = ({ projectId, privilegeType = "All", children }) => {
	const navigate = useNavigate();

	const [canView, setCanView] = useState<boolean>(true);

	const fetch = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(projectId!);

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

			// if (privilege?.updatePrivilege === true) {
			// 	setCanView(true);
			// } else {
			// 	setCanView(false);
			// }
		},
		[projectId, privilegeType, setCanView]
	);

	useEffect(() => {
		if (projectId) {
			fetch();
		} else {
			setCanView(true);
		}
	}, [projectId, fetch, canView, setCanView]);

	const loggedUser: APILoggedUser = useStore(
		(state: { loggedInUser: any }) => state.loggedInUser
	);
	const setLoggedUser = useStore((state) => state.setLoggedInUser);

	useEffect(() => {
		const fetchData = async () => {
			const { data: myRole } = await getMyRole();
			const role = myRole?.role.name!;

			if (role !== loggedUser?.role!) {
				setLoggedUser({ ...loggedUser, role: role });
			}

			// console.log(myRole);
			// console.log(myRole, loggedUser);

			if (loggedUser.userName === "") {
				const { data, error } = await getMyDetail();
				if (error) {
					if (error.response.status === 401) {
						navigate(RoutePath.LOGIN);
					}
					console.log(error);
				}

				if (data) {
					setLoggedUser(data);
				}
			}
		};

		fetchData();
	}, [loggedUser, navigate, setLoggedUser]);

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
			{" "}
			{!loggedUser ? (
				<Loader />
			) : (
				<ErrorBoundary
					FallbackComponent={ErrorFallback}
					onReset={() => {
						// reset the state of your app so the error doesn't happen again
					}}
				>
					<Header />
					<div className={styles.layout}>
						{!canView ? <NotAuthorized /> : children}
					</div>
					<Footer />{" "}
				</ErrorBoundary>
			)}
		</>
	);
};

export default Layout;
