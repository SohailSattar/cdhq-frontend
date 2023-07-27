import { useEffect, useState } from "react";
import { getWorkMode } from "../../../../../../api/workMode/get/getWorkMode";
import { ShadowedContainer, Welcome } from "../../../../../../components";
import { useStore } from "../../../../../../utils/store";
import styles from "./styles.module.scss";
import { DropdownOption } from "../../../../../../components/Dropdown";
import { getEmployeeAttendanceCategory } from "../../../../../../api/attendance/get/getEmployeeAttendanceCategory";



const SearchBox = () => {
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);
    const [workMode, setWorkMode] = useState<DropdownOption[]>([]);
    const [employeeAttendanceCategories, setEmployeeAttendanceCategories] = useState<DropdownOption[]>([]);


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
						label: language !== 'ar' ? x.name : x.nameEnglish,
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


    return (
		<div className={styles.home}>
				
            
           
           




		</div>
	);



};

export default SearchBox;