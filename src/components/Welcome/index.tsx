import { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

interface Props {
	name: string;
	role?: string;
}

const Welcome: FC<Props> = ({ name, role }) => {
	const [t] = useTranslation("common");

	return (
		<div className={styles.welcome}>
			{t("home.welcome", { framework: "React" })}, {name}
		</div>
	);
};

export default Welcome;
