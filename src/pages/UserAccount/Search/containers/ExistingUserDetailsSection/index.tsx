import ExistingUserDetails from "../ExistingUserDetails";
import { FC } from "react";

import styles from "./styles.module.scss";
import { APIExistingUser } from "../../../../../api/users/types";
import { useTranslation } from "react-i18next";
import { Table } from "../../../../../components";
import { Column } from "react-table";
import { ExistingUserTable } from "../type";
import { useStore } from "../../../../../utils/store";

interface Props {
	list: APIExistingUser[];
	onClick: (e: any) => void;
}

const ExistingUserDetailsSection: FC<Props> = ({ list, onClick }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const userid = t("user.id", { framework: "React" });
	const logName = t("user.logName", { framework: "React" });
	const empNo = t("user.employeeNumber", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const fullName = t("user.fullName", { framework: "React" });
	const department = t("department.name", { framework: "React" });
	const className = t("user.class", { framework: "React" });

	console.log(list);

	// const columns: Column<ExistingUserTable>[] = [
	// 	{
	// 		Header: userid,
	// 		accessor: (p) => p.id,
	// 	},
	// 	{
	// 		Header: logName,
	// 		accessor: (p) => p.logName,
	// 	},
	// 	{
	// 		Header: empNo,
	// 		accessor: (p) => p.employeeNo,
	// 	},
	// 	{
	// 		Header: fullName,
	// 		accessor: (p) => (language != "ar" ? p.name : p.nameEnglish),
	// 	},
	// 	{
	// 		Header: rank,
	// 		accessor: (p) => (language != "ar" ? p.rank.name : p.rank.nameEnglish),
	// 	},
	// 	{
	// 		Header: "_",
	// 		accessor: (p) => (language != "ar" ? p.rank.name : p.rank.nameEnglish),
	// 	},
	// 	// {
	// 	// 	Header: "Horse",
	// 	// 	accessor: (p) => p.age,
	// 	// },
	// 	// {
	// 	// 	Header: "Gender",
	// 	// 	accessor: (p) => p.gender,
	// 	// 	Cell: ({ value }: any) => <div>{value} 😆 </div>,
	// 	// },
	// ];

	return (
		<div>
			<div className={styles.heading}>
				{t("user.names", { framework: "React" })} ({list.length})
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>{userid}</th>
						<th>{logName}</th>
						<th>{empNo}</th>
						<th>{rank}</th>
						<th>{fullName}</th>
						<th>{department}</th>
						<th>{className}</th>
						<th className={styles.headerCell}></th>
					</tr>
				</thead>
				<tbody>
					{list.map((employee, index) => (
						<ExistingUserDetails
							detail={employee}
							onClick={onClick}
							key={index}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ExistingUserDetailsSection;
