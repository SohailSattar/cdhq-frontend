import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRole } from "../../../api/users/get/getRole";
import { ProjectUserForm, IProjectUserFormInputs } from "../../../components";
import { ROLE } from "../../../utils";
import { APIProjectToUser } from "../../../api/userProjects/types";

import { assignNewProjectToUser } from "../../../api/userProjects/add/assignNewProjectToUser";

import * as RoutePath from "../../../RouteConfig";

const AssignUserToProjectPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const [isNormalUser, setIsNormalUser] = useState(true);

	useEffect(() => {
		if (!id) {
			navigate(RoutePath.PROJECT);
		}
	}, [id, navigate]);

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				const { data } = await getRole(id!);

				if (data?.role === undefined || data?.role?.name! === ROLE.USER) {
					setIsNormalUser(true);
				} else {
					setIsNormalUser(false);
				}
			}
		};

		fetchData();
	}, [id]);

	const assignProjectClickHandler = async (
		formInputs: IProjectUserFormInputs
	) => {
		const userId = formInputs.user?.value!.toString();
		const privilegeId = formInputs.privilege?.value!.toString();
		const deptId = formInputs.department?.value!.toString();
		const workflowStartId = formInputs.workflowStart?.value!.toString();
		const workflowEndId = formInputs.workflowEnd?.value!.toString();

		const deptStruct = formInputs.structureType?.value!.toString();
		const canGrant = formInputs.canGrant;
		const exportToExcel = formInputs.canExportExcel;
		const exportToPdf = formInputs.canExportPdf;

		const params: APIProjectToUser = {
			projectId: id!,
			userId: userId!,
			privilegeId: privilegeId!,
			WorkflowStartFromId: workflowStartId!,
			WorkflowEndToId: workflowEndId!,
			departmentId: deptId!,
			departmentStructureType: deptStruct,
			canGrant: canGrant,
			canExportExcel: exportToExcel,
			canExportPdf: exportToPdf,
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
		<ProjectUserForm
			mode="ADD"
			id={id!}
			isNormalUser={isNormalUser}
			onActionButtonClick={assignProjectClickHandler}
			actionButtonText={t("button.save", { framework: "React" })}
		/>
	);
};

export default AssignUserToProjectPage;
