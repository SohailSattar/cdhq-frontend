import HeaderLogo from "../../assets/images/header_login.png";

import styles from "./styles.module.scss";

const LogoHeader = () => {
	return (
		<div className={styles.navLogo}>
			<img
				src={HeaderLogo}
				alt="text"
				className={styles.image}
			/>
		</div>
	);
};

export default LogoHeader;
