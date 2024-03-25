import { EmployeeTable, PageContainer } from "../../../components";

import * as RoutePath from "../../../RouteConfig";

const EmployeeHomePage = () => {
	return (
		<PageContainer
			title="Employees"
			showAddButton
			displayExportButton
			btnAddUrlLink={RoutePath.EMPLOYEE_NEW}>
			<EmployeeTable />
		</PageContainer>
	);
};

export default EmployeeHomePage;
