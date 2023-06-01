import { FC } from "react";
import { IProjectFormInputs } from "../../Form";
import { Button, ProjectDetail, ShadowedContainer } from "../..";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface Props {
	data: IProjectFormInputs;
	onClick: () => {};
}

const ProjectPreview: FC<Props> = ({ data, onClick }) => {
	const [t] = useTranslation("common");

	const {
		iconName,
		name,
		nameEnglish,
		parentProject,
		projectGroup,
		departmentCategory,
		withAcademy,
		hasWorkflow,
		pathLink,
		isExternalPath,
	} = data;

	return (
		<div>
			<ShadowedContainer>
				<div className={styles.projectPreview}>
					{iconName && (
						<div className={clsx(styles.section)}>
							<div className={styles.imageContainer}>
								<img
									src={iconName}
									alt="logo"
									className={styles.image}
								/>
							</div>
						</div>
					)}
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.name", { framework: "React" })}
							</div>
							<div>{name}</div>
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.nameEnglish", { framework: "React" })}
							</div>
							<div>{nameEnglish}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.parentProject", { framework: "React" })}
							</div>
							<div>{parentProject?.label}</div>
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.group", { framework: "React" })}
							</div>
							<div>{projectGroup.label}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.deptCat", { framework: "React" })}
							</div>
							<div>{departmentCategory?.label! || "N/A"}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.withAcademy", { framework: "React" })}
							</div>
							<div>{(withAcademy === true ? "Yes" : "No") || "No"}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.hasWorkflow", { framework: "React" })}
							</div>
							<div>{(hasWorkflow === true ? "Yes" : "No") || "No"}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.urlLink", { framework: "React" })}
							</div>
							<div>{pathLink}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("project.isExternal", { framework: "React" })}
							</div>
							<div>{(isExternalPath === true ? "Yes" : "No") || "No"}</div>
						</div>
					</div>
				</div>
			</ShadowedContainer>
			<div>
				<Button onClick={onClick}>
					{t("button.save", { framework: "React" })}
				</Button>
			</div>
		</div>
	);
};

export default ProjectPreview;
