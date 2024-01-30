import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { APIProjectToUser } from "../../../api/userProjects/types";
import { assignNewProjectToUser } from "../../../api/userProjects/add/assignNewProjectToUser";
import { getRole } from "../../../api/users/get/getRole";
import {
	IUserProjectFormInputs,
	PageContainer,
	UserProjectForm,
} from "../../../components";

import * as RoutePath from "../../../RouteConfig";
import { Id, ROLE } from "../../../utils";
import { getUserDetail } from "../../../api/users/get/getUserDetail";
import { useStore } from "../../../utils/store";

const AssignProjectToUserPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const navigate = useNavigate();

	const [title, setTitle] = useState<string>("");

	const [isNormalUser, setIsNormalUser] = useState(true);

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

	useEffect(() => {
		const fetchDetails = async () => {
			const { data } = await getUserDetail(id!);

			if (data) {
				const { employeeNo, rank, name, nameEnglish } = data;

				if (language !== "ar") {
					const formattedText = `${employeeNo} ${rank.name}/${name}`;
					setTitle(formattedText);
				} else {
					const formattedText = `${employeeNo} ${rank.nameEnglish}\\${nameEnglish}`;
					setTitle(formattedText);
				}
			}
		};

		if (id) {
			fetchDetails();
		}
	}, [id, language, t]);

	const assignProjectClickHandler = async (
		formInputs: IUserProjectFormInputs
	) => {
		let departId: Id = 0;

		departId = formInputs.department?.value!;

		// if (formInputs.center.value !== "") {
		// 	departId = formInputs.center.value;
		// }

		const projectId = formInputs.project.value!.toString();
		const privilegeId = formInputs.privilege?.value!.toString();
		const deptId = departId;
		const workflowStartId = formInputs.workflowStart?.value!.toString();
		const workflowEndId = formInputs.workflowEnd?.value!.toString();
		const structType = formInputs.structureType?.value!.toString();
		const canGrant = formInputs.canGrant!;
		const exportToExcel = formInputs.canExportExcel;
		const exportToPdf = formInputs.canExportPdf;

		const params: APIProjectToUser = {
			userId: id!,
			projectId: projectId!,
			privilegeId: privilegeId!,
			WorkflowStartFromId: workflowStartId!,
			WorkflowEndToId: workflowEndId!,
			departmentId: deptId!,
			departmentStructureType: structType,
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
		<PageContainer
			lockFor={[ROLE.USER]}
			displayContent={true}
			showBackButton
			btnBackUrlLink={`${RoutePath.USER_EDIT.replace(RoutePath.ID, id!)}`}
			btnBackLabel={t("button.back", { framework: "React" })}>
			<UserProjectForm
				isNormalUser={isNormalUser}
				title={t("userProject.assignNewProject", { framework: "React" })
					.toString()
					.replace("_USER_", title)}
				onActionButtonClick={assignProjectClickHandler}
				actionButtonText={t("button.save", { framework: "React" })}
			/>
		</PageContainer>
	);
};

export default AssignProjectToUserPage;
