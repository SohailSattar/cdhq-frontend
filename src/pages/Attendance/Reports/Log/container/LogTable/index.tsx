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
import MultiSelectCheckBox from "../../../../../../components/DropdownWithCheckBoxes";
import { DropdownOption } from "../../../../../../components/Dropdown";


interface Props{
    data: APIAttendanceLogItem[];
}
const LogTable:FC<Props> = ({ data }) =>{
    const [t] = useTranslation("common");
    const language = useStore((state) => state.language);
    const [currentPage, setCurrentPage] = useState(1);
	

    const status = t("attendance.log.status", { framework: "React" });
    const employeeNo = t("attendance.log.employeeNo", { framework: "React" });
	const rank = t("attendance.log.rank", { framework: "React" });
    const personName = t("attendance.log.personName", { framework: "React" });
	const dayName = t("attendance.log.dayName", { framework: "React" });
    const date = t("attendance.log.formatedDate", { framework: "React" });
	const timeIn = t("attendance.log.timeIn", { framework: "React" });
	const timeOut = t("attendance.log.timeOut", { framework: "React" });
	const workMode = t("attendance.log.workMode", { framework: "React" });
	const workGroup = t("attendance.log.workGroup", { framework: "React" });
    const leaveType = t("attendance.log.leaveType", { framework: "React" });
	const leaveNotes = t("attendance.log.leaveNotes", { framework: "React" });
	const departmentName = t("attendance.log.departmentName", { framework: "React" });
	const contract = t("attendance.log.contract", { framework: "React" });
	const contractDescription = t("attendance.log.contractDescription", { framework: "React" });


    const colorValue = "ICON_RED";
	const [allFields, setAllFields] = useState<DropdownOption[]>([{ label: status, value: status}, {label: employeeNo, value: employeeNo}, {label: rank, value: rank}, {label: personName, value: personName}, {label: dayName, value: dayName}, {label: date, value: date}, {label: timeIn, value: timeIn}, {label: timeOut, value: timeOut}, {label: workMode, value: workMode}, {label: workGroup, value: workGroup}, {label: leaveType, value: leaveType}, {label: leaveNotes, value: leaveNotes}, {label: departmentName, value: departmentName}, {label: contract, value: contract}, {label: contractDescription, value: contractDescription} ]);
	const [selectedFields, setSelectedFields] = useState<DropdownOption[]>([{ label: status, value: status}, {label: employeeNo, value: employeeNo}, {label: rank, value: rank}, {label: personName, value: personName}, {label: dayName, value: dayName}, {label: date, value: date}, {label: timeIn, value: timeIn}, {label: timeOut, value: timeOut} ]);
	//const [hideFields, setHideFields] = useState<DropdownOption[]>([{label: workMode, value: workMode}, {label: workGroup, value: workGroup}, {label: leaveType, value: leaveType}, {label: leaveNotes, value: leaveNotes}, {label: departmentName, value: departmentName}, {label: contract, value: contract}, {label: contractDescription, value: contractDescription}  ]);
	const [hideFields, setHideFields] = useState<string[]>([workMode, workGroup,  leaveType, leaveNotes,  departmentName, contract,contractDescription ]);

	// const getCirculStyle = (iconColor: string) => {
	// 	let circuleStyle:any = {styles.ICON_RED};
	// 	switch (iconColor) {
	// 		case 'ICON_RED':
	// 			circuleStyle = {styles.ICON_RED}
	// 			break;
		
	// 		default:
	// 			break;
	// 	}
	// }

    const columns: Column<APIAttendanceLogItem>[] = [
        { 
            Header: status, 
            accessor: (p) => p.iconColor!,
			Cell: ({ value }: any) => (
                <div className={styles[value]}></div>
				
			)
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
			accessor: (p) => p.dayName,
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
			accessor: (p) => p.workGroup,
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
			accessor: (p) => p.leaveType,
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


	const onFieldChangeHandler = (selectedOptions: DropdownOption[]) =>{
		setHideFields(
			allFields.filter(f => !selectedOptions.some(item => item.value === f.value)).map(xx => xx.label)
		);
	}
	
	useEffect(()=>{
		console.log(hideFields)
	}, [hideFields])

    return(
        <>
			<div className={styles.table}>
				<div>
					<MultiSelectCheckBox options={allFields} selectedOptions={selectedFields} onSelectedOptions={onFieldChangeHandler} />
				</div>
				
				{/* <TotalCount
					label={t("project.count", { framework: "React" })}
					count={10}
				/> */}
				
				<Table
					data={data!}
					headerTextTransformation="capitalize"
					columns={columns}
					columnsToHide={hideFields}   //{displayActionsColumn ? [] : [actions]}
					noRecordsText={t("table.noAttendance", { framework: "React" })}
				/>
				
				<Pagination
					className={styles.paginationBar}
					currentPage={currentPage}
					totalCount={100}
					pageSize={10}
					onPageChange={(page) => pageChangeHandler(page)}
				/>
			</div>
			
			
        </>
    )
}

export default LogTable;