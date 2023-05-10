import { FC } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";

import styles from "./styles.module.scss";
import { useStore } from "../../utils/store";
import ShadowedContainer from "../ShadowedContainer";

interface Props {
	createdBy: string;
	createdOn: string;
	updatedBy?: string;
	updatedOn?: string;
}

const MetaDataDetails: FC<Props> = ({
	createdBy,
	createdOn,
	updatedBy,
	updatedOn,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const formattedCreatedDate = createdBy
		? format(new Date(createdOn), "dd MMMM yyyy", {
				locale: language !== "ar" ? ar : enGB,
		  })
		: "";

	const formattedUpdatedDate = updatedBy
		? format(new Date(updatedOn!), "dd MMMM yyyy", {
				locale: language !== "ar" ? ar : enGB,
		  })
		: "";

	return (
		<ShadowedContainer className={styles.infoContainer}>
			{createdBy && (
				<div className={styles.section}>
					<div className={styles.content}>
						<div className={language !== "ar" ? styles.title : styles.titleLTR}>
							{t("common.created", { framework: "React" })}:
						</div>
						<div>
							<span>[{createdBy}]</span> {formattedCreatedDate}
						</div>
					</div>
				</div>
			)}
			{updatedBy && (
				<div className={styles.section}>
					<div className={styles.content}>
						<div className={language !== "ar" ? styles.title : styles.titleLTR}>
							{t("common.updated", { framework: "React" })}:
						</div>
						<div>
							[{updatedBy}] {formattedUpdatedDate}
						</div>
					</div>
				</div>
			)}
		</ShadowedContainer>
	);
};

export default MetaDataDetails;
