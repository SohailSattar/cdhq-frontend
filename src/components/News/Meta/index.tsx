import { FC } from "react";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useStore } from "../../../utils/store";

interface Props {
	postedDate: string;
	postedBy: string;
}

const NewsMeta: FC<Props> = ({ postedDate, postedBy }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	return (
		<div
			className={clsx(
				styles.container,
				language === "ar" && styles.containerLTR
			)}>
			<div>
				{t("common.dated", { framework: "React" })}: {postedDate}{" "}
			</div>
			<div>
				{t("common.created", { framework: "React" })}: {postedBy}{" "}
			</div>
		</div>
	);
};

export default NewsMeta;
