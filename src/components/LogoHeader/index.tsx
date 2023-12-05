import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/images/header_login.png";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";

const LogoHeader = () => {
	return (
		<div className={styles.navLogo}>
			<Link to={RoutePath.ROOT}>
				<img
					src={HeaderLogo}
					alt="text"
					className={styles.image}
				/>
			</Link>
		</div>
	);
};

export default LogoHeader;
