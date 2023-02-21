import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

const NotAuthorized = () => {
	const [t] = useTranslation("common");

	return (
		<div className={styles.notAuthorized}>
			{t("message.unauthorized", { framework: "React" })}
		</div>
	);
};

export default NotAuthorized;
