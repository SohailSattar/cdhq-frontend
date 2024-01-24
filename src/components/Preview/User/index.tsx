import { FC } from "react";
import { IUserFormInputs } from "../../Form";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer } from "../..";

import styles from "./styles.module.scss";

interface Props {
	data: IUserFormInputs;
	onClick: () => {};
}

const UserPreview: FC<Props> = ({ data, onClick }) => {
	const [t] = useTranslation("common");

	const {
		employeeNo,
		logName,
		name,
		nameEnglish,
		phone,
		email,
		department,
		userClass,
		rank,
	} = data;

	return (
		<div>
			<ShadowedContainer>
				<div className={styles.userPreview}>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.employeeNumber", { framework: "React" })}
							</div>
							<div>{employeeNo}</div>
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.logName", { framework: "React" })}
							</div>
							<div>{logName}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.name", { framework: "React" })}
							</div>
							<div>{name}</div>
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.nameEnglish", { framework: "React" })}
							</div>
							<div>{nameEnglish}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.phone", { framework: "React" })}
							</div>
							<div>{phone || "N/A"}</div>
						</div>{" "}
						<div className={styles.content}>
							<div className={styles.title}>
								{t("user.email", { framework: "React" })}
							</div>
							<div>{email}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("department.name", { framework: "React" })}
							</div>
							<div>{department.label}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("class.name", { framework: "React" })}
							</div>
							<div>{userClass.label}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("rank.name", { framework: "React" })}
							</div>
							<div>{rank.label}</div>
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

export default UserPreview;
