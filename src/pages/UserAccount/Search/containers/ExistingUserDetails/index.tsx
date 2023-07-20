import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer } from "../../../../../components";

import { useStore } from "../../../../../utils/store";

import { APIExistingUser } from "../../../../../api/users/types";

import styles from "./styles.module.scss";

interface Props {
	detail: APIExistingUser;
	onClick: (detail: any) => void;
}

const ExistingUserDetails: FC<Props> = ({ detail, onClick }) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const selectButtonHandler = (e: any) => {
		onClick(e);
	};

	let rank = "";
	let name = "";
	let department = "";
	let className = "";

	if (language !== "ar") {
		rank = detail.rank?.name;
		name = detail.name;
		department = detail.department?.name!;
		className = detail.class?.name!;
	} else {
		// Check if English value is there

		// Rank
		if (detail.rank.nameEnglish) {
			rank = detail.rank.nameEnglish!;
		} else {
			rank = detail.rank.name;
		}

		// Employee Name
		if (detail.nameEnglish) {
			name = detail.nameEnglish!;
		} else {
			name = detail.name;
		}

		// Department
		if (detail.department.nameEnglish) {
			department = detail.department.nameEnglish!;
		} else {
			department = detail.department?.name!;
		}

		// Recruiter
		if (detail.class?.nameEnglish!) {
			className = detail.class?.nameEnglish!;
		} else {
			className = detail.class?.name!;
		}
	}

	return (
		<tr>
			<td className={styles.cell}>{detail.id}</td>
			<td>{detail.employeeNo}</td>
			<td>{rank}</td>
			<td>{name}</td>
			<td>{department}</td>
			<td>{className}</td>
			<td>{detail.logName}</td>
			<td className={styles.buttonSection}>
				<Button onClick={() => selectButtonHandler(detail)}>
					{t("button.select", { framework: "React" })}
				</Button>
			</td>
		</tr>
	);
};

export default ExistingUserDetails;
