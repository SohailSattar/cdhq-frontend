import { FC } from "react";
import { Button } from "@material-ui/core";
import { useCookies } from "react-cookie";
import localStorageService from "../../network/localStorageService";

import styles from "./styles.module.scss";
import clsx from "clsx";

interface Props {
	label: string;
	onClick?: () => void;
	className?: string;
}

const Logout: FC<Props> = ({ label, onClick = () => {}, className }) => {
	const [, , removeCookie] = useCookies([
		"id",
		"name",
		"nameEnglish",
		"userName",
		"role",
	]);

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
		removeLocalStorageData();
		removeCookies();
		onClick();
	};

	return (
		<Button
			onClick={logoutClickHandler}
			className={clsx(className, styles.logoutButton)}
		>
			{/* className */}
			{label}
		</Button>
	);
};

export default Logout;
