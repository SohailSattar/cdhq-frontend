import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

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
				<span>{t("footer.copyright", { framework: "React" })}</span>
				{"\u00A0"}
				<span>©</span>
				{"\u00A0"}
				{new Date().getFullYear()} {t("footer.text", { framework: "React" })}
			</div>
		</footer>
	);
};

export default Footer;
