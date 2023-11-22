import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import { FooterExternalLinks, FooterQRTable, Hr } from "..";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
	menuButton: {
		fontFamily: "DINNextLTArabic",
	},
}));

interface Props {
	showQRCodes?: boolean;
	showLinks?: boolean;
}

const Footer: FC<Props> = ({ showQRCodes = false, showLinks = false }) => {
	const [t] = useTranslation("common");
	const { menuButton } = useStyles();

	return (
		<footer className={clsx(styles.footer, showQRCodes ? styles.unfix : "")}>
			{showQRCodes && (
				<>
					<FooterQRTable />
					<Hr />
				</>
			)}
			{showLinks && <FooterExternalLinks />}

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
