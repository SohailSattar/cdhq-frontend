import { ShadowedContainer, SubModuleMenuItem } from "../../../components";
import Welcome from "../../../components/Welcome";
import { useStore } from "../../../utils/store";
import styles from './styles.module.scss'
import * as RoutePath from "../../../RouteConfig";

const AttendanceHome = () =>{
    const language = useStore((state) => state.language);
    const loggedInUser = useStore((state) => state.loggedInUser);

    const iconRegistration = require('../../../assets/images/attendance/registration-icon.jpg');
    const iconDeviceControl = require('../../../assets/images/attendance/biometricDevice.jpg');
    const iconReports = require('../../../assets/images/attendance/status-report-icon-4.jpg');


    const reportLink = RoutePath.ATTENDANCE_REPORTS;




    return(
        <>
            <Welcome
                name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
                role={loggedInUser.role}
            />

            <ShadowedContainer className="shadow shadow-showcase p-25 text-center">				
                <ul className={styles.list} >
                    <SubModuleMenuItem title={"Registration"} link={"#"} icon={iconRegistration} />
                    <SubModuleMenuItem title={"Device Control"} link={"#"} icon={iconDeviceControl} />
                    <SubModuleMenuItem title={"Reports"} link={reportLink} icon={iconReports} />
                </ul>
            </ShadowedContainer>

            {/* <div className="">
                
            </div> */}
            
        </>
        



    )
}


export default AttendanceHome;