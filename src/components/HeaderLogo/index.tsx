import { FC } from "react";
import { Link } from "react-router-dom";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";

export interface Props {
	src: string;
	isLoggedIn: boolean;
}

const HeaderLogo: FC<Props> = ({ src, isLoggedIn }) => {
	return (
		<Link to={isLoggedIn ? RoutePath.HOME : RoutePath.ROOT}>
			{" "}
			<img src={src} alt="" className={styles.logo} />
		</Link>
	);
};

export default HeaderLogo;
