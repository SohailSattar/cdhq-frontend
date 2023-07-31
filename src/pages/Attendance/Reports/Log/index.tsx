import { useState } from "react";
import { getAttendanceLog } from "../../../../api/attendance/get/getLog";
import { ShadowedContainer, Welcome } from "../../../../components";
import { useStore } from "../../../../utils/store";
import LogTable from "./container/LogTable";
import SearchBox from "./container/SearchBox";
import { ISearchFields } from "./container/types";
import styles from "./styles.module.scss";
import { APIAttendanceLogItem } from "../../../../api/attendance/types";

const AttendanceLog = () => {
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);

	const [logs, setLogs] = useState<APIAttendanceLogItem[]>([]);

	const onSearchHandler = async (fields: ISearchFields) =>{
		console.log(fields);

		const { data } = await getAttendanceLog();

		if (data) {
			setLogs(data);
		}



	}



    return (
		<div className={styles.home}>
			<Welcome
				name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
				role={loggedInUser.role}
			/>
			

            <ShadowedContainer>
				
                <SearchBox searchOptions={onSearchHandler} />
                
			</ShadowedContainer>


			<ShadowedContainer>				
                <LogTable data={logs} />                
			</ShadowedContainer>

		</div>
	);



};

export default AttendanceLog;