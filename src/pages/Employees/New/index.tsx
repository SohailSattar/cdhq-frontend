import {
	EmployeeForm,
	IEmployeeFormInputs,
	PageContainer,
} from "../../../components";
import * as RoutePath from "../../../RouteConfig";

const EmployeeNewPage = () => {
	return (
		<PageContainer
			title="New Employee"
			showBackButton
			btnBackUrlLink={RoutePath.EMPLOYEE}>
			<EmployeeForm
				actionButtonText={""}
				onSubmit={function (data: IEmployeeFormInputs): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</PageContainer>
	);
};

export default EmployeeNewPage;
