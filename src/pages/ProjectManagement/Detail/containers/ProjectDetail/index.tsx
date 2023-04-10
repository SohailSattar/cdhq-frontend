import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ShadowedContainer } from "../../../../../components";
import styles from "./styles.module.scss";

interface Props {
	imageSrc?: string;
	name: string;
	nameEnglish: string;
	groupName: string;
	groupNameEnglish: string;
}

const ProjectDetail: FC<Props> = ({
	imageSrc,
	name,
	nameEnglish,
	groupName,
	groupNameEnglish,
}) => {
	const [t] = useTranslation("common");

	return (
		<ShadowedContainer>
			<div className={styles.projectDetail}>
				{imageSrc && (
					<div className={styles.section}>
						<img src={imageSrc} alt="logo" className={styles.image} />
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
							{t("project.group", { framework: "React" })}
						</div>
						<div>{groupName}</div>
					</div>
					<div className={styles.content}>
						<div className={styles.title}>
							{t("project.groupEnglish", { framework: "React" })}
						</div>
						<div>{groupNameEnglish}</div>
					</div>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default ProjectDetail;
