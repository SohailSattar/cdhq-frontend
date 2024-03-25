import { useNavigate, useParams } from "react-router-dom";
import {
	EmployeeForm,
	IEmployeeFormInputs,
	PageContainer,
} from "../../../components";
import * as RoutePath from "../../../RouteConfig";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { APIEmployeeDetail } from "../../../api/employees/types";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { getEmployeeDetails } from "../../../api/employees/get/getEmployeeDetails";
import { Project } from "../../../data/projects";
import { APIPrivileges } from "../../../api/privileges/type";

const EmployeeEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [employee, setEmployee] = useState<APIEmployeeDetail>();
	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const fetch = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(Project.Employees);
			if (privilege) {
				const {
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivileges({
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});

				if (privilege?.updatePrivilege! !== false) {
					const { data } = await getEmployeeDetails(id!);
					setEmployee(data);
				} else {
					const url = RoutePath.NEWS_DETAIL.replace(
						RoutePath.ID,
						id?.toString()!
					);
					navigate(url);
				}
			}
		},
		[id, navigate]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	return (
		<PageContainer
			title="Edit Employee"
			showBackButton
			btnBackUrlLink={RoutePath.EMPLOYEE}>
			<EmployeeForm
				data={employee}
				actionButtonText={""}
				onSubmit={function (data: IEmployeeFormInputs): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</PageContainer>
	);
};

export default EmployeeEditPage;
