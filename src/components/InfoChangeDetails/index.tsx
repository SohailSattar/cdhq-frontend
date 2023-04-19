import { FC } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";

import styles from "./styles.module.scss";
import { useStore } from "../../utils/store";

interface Props {
	createdBy: string;
	createdOn: string;
	updatedBy?: string;
	updatedOn?: string;
}

const InfoChangeDetails: FC<Props> = ({
	createdBy,
	createdOn,
	updatedBy,
	updatedOn
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const formattedCreatedDate = createdBy
		? format(new Date(createdOn), "dd MMMM yyyy", {
				locale: language !== "ar" ? ar : enGB
		  })
		: "";

	const formattedUpdatedDate = updatedBy
		? format(new Date(updatedOn!), "dd MMMM yyyy", {
				locale: language !== "ar" ? ar : enGB
		  })
		: "";

	return (
		<div className={styles.infoContainer}>
			{createdBy && (
				<div className={styles.section}>
					<div className={styles.content}>
						<div className={styles.title}>
							{t("common.createdBy", { framework: "React" })}
						</div>
						<div>{createdBy}</div>
					</div>
					<div className={styles.content}>
						<div className={styles.title}>
							{t("common.createdOn", { framework: "React" })}
						</div>
						<div>{formattedCreatedDate}</div>
					</div>
				</div>
			)}
			{updatedBy && (
				<div className={styles.section}>
					<div className={styles.content}>
						<div className={styles.title}>
							{t("common.updatedBy", { framework: "React" })}
						</div>
						<div>{updatedBy}</div>
					</div>
					<div className={styles.content}>
						<div className={styles.title}>
							{t("common.updatedOn", { framework: "React" })}
						</div>
						<div>{formattedUpdatedDate}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InfoChangeDetails;
