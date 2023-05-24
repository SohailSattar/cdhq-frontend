import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	IUserProjectFormInputs,
	PageContainer,
	UserProjectForm,
} from "../../../components";
import { useStore } from "../../../utils/store";

import { getUserProject } from "../../../api/userProjects/get/getUserProject";
import { updateUserProject } from "../../../api/userProjects/update/updateUserProject";

import * as RoutePath from "../../../RouteConfig";
import {
	APIUpdateUserProjectDetail,
	APIUserProjectDetail,
} from "../../../api/userProjects/types";
import { Id, ROLE } from "../../../utils";
import { Project } from "../../../data/projects";

const UserProjectEditPage = () => {
	const { userId, userProjectId } = useParams<{
		userId: string;
		userProjectId: string;
	}>();

	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const { role } = useStore((state) => state.loggedInUser);
	const language = useStore((state) => state.language);

	const [heading, setHeading] = useState("");

	const [userProject, setUserProject] = useState<APIUserProjectDetail>();

	const [isNormalUser, setIsNormalUser] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getUserProject(userProjectId!);

			if (data) {
				setUserProject(data);

				const userName =
					language !== "ar" ? data?.user.name! : data?.user.nameEnglish!;

				setHeading(
					t("message.userProjectEdit", { framework: "React" }) + "" + userName
				);

				// // Can Grant
				// if (
				// 	data?.project.id === Project.UserManagement &&
				// 	role !== ROLE.SUPERADMIN
				// ) {
				// 	setIsNormalUser(true);
				// } else {
				// 	setIsNormalUser(false);
				// }
			}
		};

		fetchData();
	}, [language, t, userId, navigate, userProjectId]);

	const updateUserProjectClickHandler = async (
		formInput: IUserProjectFormInputs
	) => {
		let departId: Id = 0;
		departId = formInput.department?.value!;

		if (formInput.center && formInput.center?.value! !== "") {
			departId = formInput.center.value;
		}

		const params: APIUpdateUserProjectDetail = {
			id: userProjectId!,
			privilegeId: formInput.privilege.value!.toString(),
			departmentId: departId!,
			workflowStartFromId: formInput.workflowStart?.value!.toString()!,
			workflowEndToId: formInput.workflowEnd?.value!.toString()!,
			departmentStructureType: formInput.structureType?.value!.toString(),
			canGrant: formInput.canGrant,
		};

		const { data, error } = await updateUserProject(params);

		if (error) {
			toast.error(error.ErrorMessage);
		}

		if (data) {
			toast.success("Updated successfully");
		}
	};

	return (
		<PageContainer
			showBackButton
			btnBackLabel={t("button.backToDetail", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.USER}/${userId}`}>
			<UserProjectForm
				// isNormalUser={isNormalUser}
				title={heading}
				data={userProject}
				disableProject={true}
				actionButtonText={t("button.update", { framework: "React" })}
				onActionButtonClick={updateUserProjectClickHandler}
			/>
		</PageContainer>
	);
};

export default UserProjectEditPage;
