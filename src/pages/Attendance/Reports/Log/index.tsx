import { ShadowedContainer, Welcome } from "../../../../components";
import { useStore } from "../../../../utils/store";
import SearchBox from "./container/SearchBox";
import styles from "./styles.module.scss";

const AttendanceLog = () => {
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);
    return (
		<div className={styles.home}>
			<Welcome
				name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
				role={loggedInUser.role}
			/>
			

            <ShadowedContainer>
				
                <SearchBox />
                
			</ShadowedContainer>




		</div>
	);



};

export default AttendanceLog;