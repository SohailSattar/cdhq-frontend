import { FC } from "react";
import { useTranslation } from "react-i18next";

import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";

import { useStore } from "../../../../../utils/store";
import { Button, ShadowedContainer } from "../../../../../components";

import { APIExistingEmployee } from "../../../../../api/employees/types";

import styles from "./styles.module.scss";

interface Props {
	detail: APIExistingEmployee;
	onClick: (detail: any) => void;
}

const ExistingEmployeeDetails: FC<Props> = ({ detail, onClick }) => {
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
		rank = detail.rank?.name!;
		name = detail.name;
		department = detail.department?.name!;
		className = detail.class?.name!;
	} else {
		// Check if English value is there

		// Rank
		if (detail.rank?.nameEnglish!) {
			rank = detail.rank?.nameEnglish!;
		} else {
			rank = detail.rank?.name!;
		}

		// Employee Name
		if (detail.nameEnglish) {
			name = detail.nameEnglish!;
		} else {
			name = detail.name;
		}

		// Department
		if (detail.department?.nameEnglish!) {
			department = detail.department?.nameEnglish!;
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
		// <ShadowedContainer>
		<tr>
			{/* <div className={styles.detail}>
					 <table>
						<tr>
							<th>{t("user.id", { framework: "React" })}</th>
							<th>{t("user.fullName", { framework: "React" })}</th>
							<th></th>
							<th></th>
						</tr>
						<tr>
							<td>{detail.id}</td>
						</tr>
					</table> 
				</div> */}
			{/* <div className={styles.detail}> */}
			<td className={styles.cell}>{detail.id}</td>
			{/* <div>
						<div className={styles.heading}>
							{t('user.logName', { framework: 'React' })}
						</div>
						<div>
							{codeNo}
						</div>
					</div> */}
			<td>{detail?.employeeNo}</td>
			<td>{rank}</td>
			<td>{name}</td>
			<td>{department}</td>
			{/* <div>
						<div className={styles.heading}>
							{t('user.gender', { framework: 'React' })}
						</div>
						<div>
							{language !== 'ar'
								? detail.gender?.name
								: detail.gender?.nameEnglish}
						</div>
					</div> */}
			<td>{className}</td>
			<td className={styles.buttonSection}>
				{detail.status.id !== 90 && (
					<Button onClick={() => selectButtonHandler(detail)}>
						{t("button.select", { framework: "React" })}
					</Button>
				)}
			</td>
		</tr>
	);
};

export default ExistingEmployeeDetails;
