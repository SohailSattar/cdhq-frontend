import { FC } from "react";
import ExistingEmployeeDetails from "../ExistingEmployeeDetails";

import { APIEmployee } from "../../../../../api/employees/types";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
	list: APIEmployee[];
	onClick: (e: any) => void;
}

const ExistingExployeeDetailsSection: FC<Props> = ({ list, onClick }) => {
	console.log(list);

	const [t] = useTranslation("common");
	return (
		<div>
			<div className={styles.heading}>
				<p>
					{t("employee.names", { framework: "React" })} ({list.length})
				</p>
			</div>
			<table className={styles.table}>
				<tbody>
					<tr>
						<th className={styles.headerCell}>
							{t("user.id", { framework: "React" })}
						</th>
						<th className={styles.headerCell}>
							{t("user.employeeNumber", { framework: "React" })}
						</th>
						<th className={styles.headerCell}>
							{t("rank.name", { framework: "React" })}
						</th>
						<th className={styles.headerCell}>
							{t("user.fullName", { framework: "React" })}
						</th>
						<th className={styles.headerCell}>
							{t("department.name", { framework: "React" })}
						</th>
						<th className={styles.headerCell}>
							{t("user.class", { framework: "React" })}
						</th>
						<th className={styles.headerCell}></th>
					</tr>
					{list.map((employee, index) => (
						// <div
						// 	className={styles.existingUser}
						// 	key={index}>
						<ExistingEmployeeDetails
							detail={employee}
							onClick={onClick}
							key={index}
						/>
						// </div>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ExistingExployeeDetailsSection;
