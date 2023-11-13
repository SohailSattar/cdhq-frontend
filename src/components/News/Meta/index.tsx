import { FC } from "react";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
	postedDate: string;
}

const NewsMeta: FC<Props> = ({ postedDate }) => {
	const [t] = useTranslation("common");
	return (
		<div className={styles.container}>
			{t("common.dated", { framework: "React" })}: {postedDate}{" "}
		</div>
	);
};

export default NewsMeta;
