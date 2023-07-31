import { FC, useEffect, useState } from "react";
import { getWorkMode } from "../../../../../../api/workMode/get/getWorkMode";
import { Button, ShadowedContainer, Welcome } from "../../../../../../components";
import { useStore } from "../../../../../../utils/store";
import styles from "./styles.module.scss";
import Dropdown, { DropdownOption } from "../../../../../../components/Dropdown";
import { getEmployeeAttendanceCategory } from "../../../../../../api/attendance/get/getEmployeeAttendanceCategory";
import DateTime from "../../../../../../components/DateTime";
import { Controller, useForm } from "react-hook-form";
import { ISearchFields } from "../types";
import { useTranslation } from "react-i18next";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


interface Props{
	searchOptions: (fields: ISearchFields) => void;
}


const SearchBox:FC<Props> = ({ searchOptions }) => {
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);
	const [t] = useTranslation("common");

	
    const [workMode, setWorkMode] = useState<DropdownOption[]>([]);
    const [employeeAttendanceCategories, setEmployeeAttendanceCategories] = useState<DropdownOption[]>([]);


	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		control,
	} = useForm<ISearchFields>({ defaultValues: { dateFrom: new Date(), dateTo: new Date() }});

    useEffect(() => {
		const fetchWorkMode = async () => {
			const { data } = await getWorkMode();

			if (data) {
				setWorkMode(
					data.map((x) => ({
						label: language !== 'ar' ? x.name : x.name,
						value: x.id,
					}))
				);
			}
		};


        const fetchEmployeeAttendanceCategory = async () => {
			const { data } = await getEmployeeAttendanceCategory();

			if (data) {
				setEmployeeAttendanceCategories(
					data.map((x) => ({
						label: language !== 'ar' ? x.name : x.name,
						value: x.id,
					}))
				);
			}
		};





		fetchWorkMode();
        fetchEmployeeAttendanceCategory();
	}, [language]);


    useEffect(()=>{
        console.log(workMode);
    }, [workMode]);

    useEffect(()=>{
        console.log(employeeAttendanceCategories);
    }, [employeeAttendanceCategories]);


	const onDateChange = (d: Date) =>{
		console.log(d);
	}

	 

	const submitHandler = (data: ISearchFields) => {
		
		searchOptions(data);
	}

    return (
		<div className={styles.searchBox}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.row}>
					<div className={styles.rowItem}>
						<div className={styles.fieldLabel}>From Date </div> 
						<Controller
							render={({ field: { value, onChange } }) => (
								<DateTime date={value} onDateChange={onChange}  />
							)}
							name="dateFrom"
							control={control}
						/>
						
					</div>
					<div className={styles.rowItem}>
					<div className={styles.fieldLabel}>To Date </div> 
						<Controller
							render={({ field: { value, onChange } }) => (
								<DateTime date={value} onDateChange={onChange}  />
							)}
							name="dateTo"
							control={control}
						/>
						
					</div>
				</div>


				<div className={styles.row}>
					<div className={styles.rowItem}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("workMode.name", { framework: "React" })}
									options={workMode}
									value={value}
									onSelect={onChange}
								/>
							)}
							name="workMode"
							control={control}
						/>
					</div>
					<div className={styles.rowItem}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("attendance.employeeCategory.name", { framework: "React" })}
									options={employeeAttendanceCategories}
									value={value}
									onSelect={onChange}
								/>
							)}
							name="employeeCategory"
							control={control}
						/>
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.rowItem}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("department.name", { framework: "React" })}
									options={[]}
									value={value}
									onSelect={onChange}
								/>
							)}
							name="department"
							control={control}
						/>
					</div>
					
				</div>	
				<div className={styles.row}>
					<div className={styles.rowItem}>
						<Button type="submit" >Search</Button>
					</div>
					
				</div>
			</form>
		</div>
	);
};

export default SearchBox;