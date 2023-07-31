/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { APIAttendanceLogItem } from "../../../../../../api/attendance/types";
import { Column } from "react-table";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../../utils/store";
import styles from "./styles.module.scss";
import Table from "../../../../../../components/Table";
import Pagination from "../../../../../../components/Pagination";
import TotalCount from "../../../../../../components/TotalCount";


interface Props{
    data: APIAttendanceLogItem[];
}
const LogTable:FC<Props> = ({ data }) =>{
    const [t] = useTranslation("common");
    const language = useStore((state) => state.language);
    const [currentPage, setCurrentPage] = useState(1);

    const status = t("attendance.status", { framework: "React" });
    const employeeNo = t("attendance.employeeNo", { framework: "React" });
	const rank = t("attendance.rank", { framework: "React" });
    const personName = t("attendance.personName", { framework: "React" });
	const dayName = t("attendance.dayName", { framework: "React" });
    const date = t("attendance.date", { framework: "React" });
	const timeIn = t("attendance.timeIn", { framework: "React" });
	const timeOut = t("attendance.timeOut", { framework: "React" });
	const workMode = t("attendance.workMode", { framework: "React" });
	const workGroup = t("attendance.workGroup", { framework: "React" });
    const leaveType = t("attendance.leaveType", { framework: "React" });
	const leaveNotes = t("attendance.leaveNotes", { framework: "React" });
	const departmentName = t("attendance.departmentName", { framework: "React" });
	const contract = t("attendance.contract", { framework: "React" });
	const contractDescription = t("attendance.contractDescription", { framework: "React" });


    const colorValue = "ICON_RED";


    const columns: Column<APIAttendanceLogItem>[] = [
        { 
            Header: status, 
            accessor: (p) => p.iconColor!
            ,
			Cell: ({ value }: any) => (
                <div className={styles.ICON_RED} title=" غياب"></div>
				
			),
        },
		{ 
            Header: employeeNo, 
            accessor: (p) => p.employeeNo!
        },
		{
			Header: rank,
			accessor: (p) => p.rank,
		},
		{
			Header: personName,
			accessor: (p) => p.personName,
		},
		{
			Header: dayName,
			accessor: (p) => p.dayNameArabic,
		},
		{
			Header: date,
			accessor: (p) => p.formatedDate
		},
		{
			Header: timeIn,
			accessor: (p) => p.timeIn,
		},
		{
			Header: timeOut,
			accessor: (p) => p.timeOut,
		},
		{
			Header: departmentName,
			accessor: (p) => p.departmentName,
		},
		{
			Header: workMode,
			accessor: (p) => p.workMode,
		},
		{
			Header: workGroup,
			accessor: (p) => p.workGroupArabic,
		},
		{
			Header: contract,
			accessor: (p) => p.contract,
		},
		{
			Header: contractDescription,
			accessor: (p) => p.contractDescription,
		},
		{
			Header: leaveType,
			accessor: (p) => p.leaveTypeArabic,
		},
		{
			Header: leaveNotes,
			accessor: (p) => p.leaveNotes,
		}
	];




    useEffect(()=>{
        console.log(data);
    },[data])

    const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};



    return(
        <>
			{/* <TotalCount
				label={t("project.count", { framework: "React" })}
				count={10}
			/> */}
            <div>
            <Table
				data={data!}
                headerTextTransformation="capitalize"
				columns={columns}
				columnsToHide={[]}   //{displayActionsColumn ? [] : [actions]}
				noRecordsText={t("table.noAttendance", { framework: "React" })}
			/>
			
            </div>
            <div>
            <Pagination
				className={styles.paginationBar}
				currentPage={currentPage}
				totalCount={10}
				pageSize={10}
				onPageChange={(page) => pageChangeHandler(page)}
			/>
            </div>
			
        </>
    )
}

export default LogTable;