import { FC } from "react";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import { useCookies } from "react-cookie";
import localStorageService from "../../network/localStorageService";

import { useStore } from "../../utils/store";
import styles from "./styles.module.scss";
import { logoutPhp } from "../../api/logout/logoutPhp";

interface Props {
	label: string;
	onClick?: () => void;
	className?: string;
}

const Logout: FC<Props> = ({ label, onClick = () => {}, className }) => {
	const setLoggedInUser = useStore((x) => x.setLoggedInUser);
	const [, , removeCookie] = useCookies([
		"id",
		"name",
		"nameEnglish",
		"userName",
		"role",
	]);

	const clearLoggedInUserState = () => {
		setLoggedInUser({
			id: 0,
			userName: "",
			name: "",
			nameEnglish: "",
			role: "",
		});
	};

	const removeLocalStorageData = () => {
		localStorageService.clearToken();
	};

	const removeCookies = () => {
		removeCookie("id", { path: "/" });
		removeCookie("name", { path: "/" });
		removeCookie("nameEnglish", { path: "/" });
		removeCookie("userName", { path: "/" });
		removeCookie("role", { path: "/" });
	};

	const logoutClickHandler = () => {
		logoutPhp();
		clearLoggedInUserState();
		removeLocalStorageData();
		removeCookies();
		onClick();
	};

	return (
		<Button
			onClick={logoutClickHandler}
			className={clsx(className, styles.logoutButton)}>
			{/* className */}
			{label}
		</Button>
	);
};

export default Logout;
