import { useTranslation } from "react-i18next";
import { MetaDataDetails, ShadowedContainer } from "../..";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { FC, useState } from "react";
import { APIUserProjectDetail } from "../../../api/userProjects/types";

interface Props {
	data: APIUserProjectDetail;
}

const UserProjectPreview: FC<Props> = ({ data }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const { project, department, departmentStructureType } = data;

	if (departmentStructureType === "9") {
	}

	return (
		<ShadowedContainer className={styles.assignProject}>
			<div className={styles.row}>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("project.name", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{language !== "ar" ? project?.name! : project?.nameEnglish!}
					</div>
				</div>
			</div>

			<div className={styles.row}>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("department.name", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{language !== "ar"
							? department?.fullName!
							: department?.fullNameEnglish!}
					</div>
				</div>
				{/* <div className={styles.rowItem}>
					<div>{t("department.center", { framework: "React" })}</div>
				</div> */}
			</div>
			<div className={styles.row}>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("userProject.withOrWithoutSubSection", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{departmentStructureType === "9"
							? t("project.withoutChild", { framework: "React" })
							: t("project.withChild", { framework: "React" })}
					</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("privilege.name", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{language !== "ar"
							? data?.privilege?.name!
							: data?.privilege?.nameEnglish!}
					</div>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("userProject.workflowStart", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{language !== "ar"
							? data.workflowStartFrom?.nameArabic!
							: data.workflowStartFrom?.nameEnglish!}
					</div>
				</div>
				<div className={styles.rowItem}>
					<div className={styles.label}>
						{t("userProject.workflowStart", { framework: "React" })}
					</div>
					<div className={styles.value}>
						{language !== "ar"
							? data.workflowEndTo?.nameArabic!
							: data.workflowEndTo?.nameEnglish!}
					</div>
				</div>
			</div>
			<MetaDataDetails
				createdBy={data.createdBy!}
				createdOn={data.createdOn!}
			/>
		</ShadowedContainer>
	);
};

export default UserProjectPreview;
