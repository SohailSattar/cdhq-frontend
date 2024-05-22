import { useTranslation } from "react-i18next";
import {
	EmployeeForm,
	EmployeeFormData,
	PageContainer,
} from "../../../components";
import * as RoutePath from "../../../RouteConfig";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../../../api/employees/add/addEmployee";
import { toast } from "react-toastify";
import { APINewEmployee } from "../../../api/employees/types";
import { ROLE } from "../../../utils";
import { useEffect, useMemo, useState } from "react";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const EmployeeNewPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [privileges, setPrivileges] = useState<APIPrivileges>();
	const [serverErrors, setServerErrors] = useState<string[]>([]);

	const fetch = useMemo(
		() => async () => {
			// setisLoading(true);
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

				if (privilege?.insertPrivilege! !== false) {
				} else {
					const url = RoutePath.EMPLOYEE;
					navigate(url);
				}
			}
		},
		[navigate]
	);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const addEmployeeHandler = async (values: EmployeeFormData) => {
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
		const params: APINewEmployee = {
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
		const { data, error } = await addEmployee(params);
		if (data?.success) {
			toast.success(
				t("message.employeeCreated", { framework: "React" }).toString()
			);
			navigate(RoutePath.EMPLOYEE);
		} else {
			toast.error(data?.message!);
			setServerErrors(data?.errors!);
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.updatePrivilege}
			title={t("page.employeeNew", { framework: "React" })}
			showBackButton
			btnBackUrlLink={RoutePath.EMPLOYEE}>
			<EmployeeForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={addEmployeeHandler}
				canUpdate={privileges?.insertPrivilege!}
				mode="INSERT"
				serverErrors={serverErrors}
			/>
		</PageContainer>
	);
};

export default EmployeeNewPage;
