import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

const useStyles = makeStyles(() => ({
	menuButton: {
		fontFamily: "DINNextLTArabic",
	},
}));

const Footer = () => {
	const [t] = useTranslation("common");
	const { menuButton } = useStyles();
	return (
		<footer className={styles.footer}>
			<div className={styles.title}>
				{t("footer.text", { framework: "React" })}
			</div>
		</footer>
	);
};

export default Footer;
