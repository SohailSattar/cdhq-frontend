import { FC } from "react";
import { useTranslation } from "react-i18next";

import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";

import { useStore } from "../../../../../utils/store";
import { Button, ShadowedContainer } from "../../../../../components";

import { APIEmployee } from "../../../../../api/employees/types";

import styles from "./styles.module.scss";

interface Props {
	detail: APIEmployee;
	onClick: (detail: any) => void;
}

const ExistingEmployeeDetails: FC<Props> = ({ detail, onClick }) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const selectButtonHandler = (e: any) => {
		onClick(e);
	};

	let hiringDate =
		detail?.hireDate !== null
			? format(new Date(detail?.hireDate!), "dd MMMM yyyy", {
					locale: language !== "ar" ? ar : enGB,
			  })
			: "N/A";

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
			<td>
				{language !== "ar" ? detail.rank?.name : detail.rank?.nameEnglish}
			</td>
			<td>{language !== "ar" ? detail.fullName : detail.nameEnglish}</td>
			<td>
				{language !== "ar"
					? detail.department?.name!
					: detail.department?.nameEnglish!}
			</td>
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
			<td>
				{language !== "ar" ? detail.class?.name! : detail.class?.nameEnglish!}
			</td>
			<td className={styles.buttonSection}>
				<Button onClick={() => selectButtonHandler(detail)}>
					{t("button.select", { framework: "React" })}
				</Button>
			</td>
		</tr>
	);
};

export default ExistingEmployeeDetails;
