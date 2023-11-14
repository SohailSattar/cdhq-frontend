import HeaderLogo from "../../assets/images/header_login.png";

import styles from "./styles.module.scss";

const LogoHeader = () => {
	return (
		<div
			// style={{
			// 	backgroundImage:
			// 		"url()",
			// }}
			className={styles.navLogo}>
			<img
				src={HeaderLogo}
				alt="text"
			/>
		</div>
	);
};

export default LogoHeader;
