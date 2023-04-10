import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { APIProjectToUser } from "../../../api/userProjects/types";
import { assignNewProjectToUser } from "../../../api/userProjects/add/assignNewProjectToUser";
import { getRole } from "../../../api/users/get/getRole";
import { PageContainer, UserProjectForm } from "../../../components";
import { IUserProjectFormInputs } from "../../../components/Form/types";

import * as RoutePath from "../../../RouteConfig";
import { Id, ROLE } from "../../../utils";

const AssignProjectToUserPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const [isNormalUser, setIsNormalUser] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getRole(id!);

			if (data?.role === undefined || data?.role?.name! === ROLE.USER) {
				setIsNormalUser(true);
			} else {
				setIsNormalUser(false);
			}
		};

		fetchData();
	}, [id]);

	const assignProjectClickHandler = async (
		formInputs: IUserProjectFormInputs
	) => {
		let departId: Id = 0;
		departId = formInputs.department?.value!;

		if (formInputs.center) {
			departId = formInputs.center.value;
		}

		const projectId = formInputs.project.value!.toString();
		const privilegeId = formInputs.privilege?.value!.toString();
		const deptId = departId;
		const workflowStartId = formInputs.workflowStart?.value!.toString();
		const workflowEndId = formInputs.workflowEnd?.value!.toString();
		const structType = formInputs.structureType?.value!.toString();
		const canGrant = formInputs.canGrant!;

		const params: APIProjectToUser = {
			userId: id!,
			projectId: projectId!,
			privilegeId: privilegeId!,
			WorkflowStartFromId: workflowStartId!,
			WorkflowEndToId: workflowEndId!,
			departmentId: deptId!,
			departmentStructureType: structType,
			canGrant: canGrant,
		};

		const { data: userProjectId } = await assignNewProjectToUser(params);

		if (userProjectId) {
			toast.success(
				t("message.userProjectAssigned", { framework: "React" }).toString()
			);
			navigate(`${RoutePath.USER}/${id}/project/${userProjectId}/edit`);
		} else {
			toast.error(
				t("message.userProjectNotAssigned", { framework: "React" }).toString()
			);
		}
	};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={`${RoutePath.USER_DETAIL.replace(":id", id!)}`}
			btnBackLabel={t("button.backToDetail", { framework: "React" })}
		>
			<UserProjectForm
				isNormalUser={isNormalUser}
				title={t("message.userProjectAdd", { framework: "React" })}
				onActionButtonClick={assignProjectClickHandler}
				actionButtonText={t("button.save", { framework: "React" })}
			/>
		</PageContainer>
	);
};

export default AssignProjectToUserPage;
