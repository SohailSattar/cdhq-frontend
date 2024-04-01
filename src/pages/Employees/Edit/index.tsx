import { useNavigate, useParams } from "react-router-dom";
import {
	EmployeeForm,
	IEmployeeFormInputs,
	PageContainer,
} from "../../../components";
import * as RoutePath from "../../../RouteConfig";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
	APIEmployeeDetail,
	APIUpdateEmployee,
} from "../../../api/employees/types";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { getEmployeeDetails } from "../../../api/employees/get/getEmployeeDetails";
import { Project } from "../../../data/projects";
import { APIPrivileges } from "../../../api/privileges/type";
import { updateEmployee } from "../../../api/employees/update/updateEmployee";
import { toast } from "react-toastify";

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
					const url = RoutePath.EMPLOYEE;
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

	const editEmployeeHandler = async (values: IEmployeeFormInputs) => {
		const {
			class: recruiter,
			rank,
			contractType,
			profession,
			nationality,
			nationalService,
			nationalServiceGroup,
			status,
			department,
			section,
			professionalTraining,
			workMode,
			workGroup,
			signList,
			actJob,
			assignedJob,
			militaryTrained,
			militaryWear,
			qualification,
			degreeCountry,
			gender,
			maritalStatus,
			religion,
			specialNeed,
			healthStatus,
			bloodType,
			...rest
		} = values;

		// departmentId: values.department.value,
		const params: APIUpdateEmployee = {
			id: id!,
			classId: recruiter.value,
			rankId: rank.value,
			contractTypeId: contractType.value,
			professionId: profession.value,
			nationalityId: nationality.value,
			nationalServiceId: nationalService.value,
			statusId: status.value,
			departmentId: department.value,
			sectionId: section.value,
			professionalTrainingId: professionalTraining.value,
			workModeId: workMode.value,
			workGroupId: workGroup.value,
			signListId: signList.value,
			actJobMOIId: actJob.value,
			assignedJobId: assignedJob.value,
			militaryTrainId: militaryTrained.value,
			militaryWearId: militaryWear.value,
			qualificationId: qualification.value,
			degreeCountryId: degreeCountry.value,
			genderId: gender.value,
			maritalStatusId: maritalStatus.value,
			religionId: religion.value,
			specialNeedId: specialNeed.value,
			healthStatusId: healthStatus.value,
			bloodTypeId: bloodType.value,
			...rest,
		};

		console.log(params);

		const { data, error } = await updateEmployee(params);

		if (data?.success) {
			toast.success(
				t("message.employeeUpdated", { framework: "React" }).toString()
			);
		} else {
			toast.error(error?.ErrorMessage);
		}
	};

	return (
		<PageContainer
			title="Edit Employee"
			showBackButton
			btnBackUrlLink={RoutePath.EMPLOYEE}>
			<EmployeeForm
				data={employee}
				actionButtonText={t("button.update", { framework: "React" }).toString()}
				onSubmit={editEmployeeHandler}
			/>
		</PageContainer>
	);
};

export default EmployeeEditPage;
