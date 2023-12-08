import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import { Counter, FooterExternalLinks, FooterQRTable, Hr } from "..";
import clsx from "clsx";
import React from "react";
import { APICount } from "../../api/visistors/types";

const useStyles = makeStyles(() => ({
	menuButton: {
		fontFamily: "DINNextLTArabic",
	},
}));

interface Props {
	showQRCodes?: boolean;
	showLinks?: boolean;
	showCounter?: boolean;
	counter: APICount;
}

const Footer: FC<Props> = ({
	showQRCodes = false,
	showLinks = false,
	showCounter = false,
	counter = { count: 0 },
}) => {
	const [t] = useTranslation("common");

	return (
		<footer className={clsx(styles.footer, showQRCodes ? styles.unfix : "")}>
			{showQRCodes && (
				<>
					<FooterQRTable />
					<Hr />
				</>
			)}
			{showLinks && (
				<>
					<FooterExternalLinks />
					<Hr />
				</>
			)}

			{showCounter && (
				<>
					<Counter initialCounter={counter} />
					<Hr />
				</>
			)}

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

export default React.memo(Footer);
