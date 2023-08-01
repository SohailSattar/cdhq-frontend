import { ShadowedContainer, SubModuleMenuItem } from "../../../../components";
import Welcome from "../../../../components/Welcome";
import { useStore } from "../../../../utils/store";
import styles from './styles.module.scss';
import * as RoutePath from "../../../../RouteConfig";

const AttendanceReportHome = () =>{
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);

    const iconLog = require('../../../../assets/images/attendance/logReprt.jpg');
    const iconChart = require('../../../../assets/images/attendance/chartReport.jpg');
    const iconDepartmentWise = require('../../../../assets/images/attendance/departmentWiseReport.jpg');
    const iconSinglePerson = require('../../../../assets/images/attendance/singlePersonReport.jpg');

    const logReportLink = RoutePath.ATTENDANCE_LOG_REPORT;




    return(
        <>
            <Welcome
                name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
                role={loggedInUser.role}
            />

            <ShadowedContainer className="shadow shadow-showcase p-25 text-center">				
                <ul className={styles.list} >
                    <SubModuleMenuItem title={"Log"} link={logReportLink} icon={iconLog} />
                    <SubModuleMenuItem title={"Single Person"} link={"#"} icon={iconSinglePerson} />
                    <SubModuleMenuItem title={"Department Wise"} link={"#"} icon={iconDepartmentWise} />
                    <SubModuleMenuItem title={"Chart"} link={"#"} icon={iconChart} />
                </ul>
            </ShadowedContainer>

        </>
        



    )
}


export default AttendanceReportHome;