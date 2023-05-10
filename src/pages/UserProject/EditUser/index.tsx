import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	Button,
	IProjectUserFormInputs,
	ProjectUserForm,
	ShadowedContainer,
} from "../../../components";
import { useStore } from "../../../utils/store";

import * as RoutePath from "../../../RouteConfig";
import { useEffect, useState } from "react";
import { getUserProject } from "../../../api/userProjects/get/getUserProject";
import { updateUserProject } from "../../../api/userProjects/update/updateUserProject";
import {
	APIUpdateUserProjectDetail,
	APIUserProjectDetail,
} from "../../../api/userProjects/types";

const ProjectUserEditPage = () => {
	const { id, userProjectId } = useParams<{
		id: string;
		userProjectId: string;
	}>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const [userProject, setUserProject] = useState<APIUserProjectDetail>();

	const [isNormalUser, setIsNormalUser] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getUserProject(userProjectId!);

			if (data) {
				setUserProject(data);
				// let userName = "";

				// if (language !== "ar") {
				// 	userName = data?.user.name!;
				// } else {
				// 	if (data?.user.nameEnglish! === null) {
				// 		userName = data?.user.name!;
				// 	} else {
				// 		userName = data?.user.nameEnglish!;
				// 	}
				// }

				// Can Grant
				if (data?.user.roleId === 0 || data?.user.roleId === 3) {
					setIsNormalUser(true);
				} else {
					setIsNormalUser(false);
				}
			}
		};

		fetchData();
	}, [language, id, navigate, userProjectId]);

	// const projectSelectHandler = (option: DropdownOption) => {
	// 	setSelectedProjectOption(option);
	// };

	const updateUserProjectClickHandler = async (
		values: IProjectUserFormInputs
	) => {
		const {
			privilege,
			department,
			workflowStart,
			workflowEnd,
			structureType,
			canGrant,
		} = values;

		const params: APIUpdateUserProjectDetail = {
			id: userProjectId!,
			privilegeId: privilege.value,
			departmentId: department.value,
			workflowStartFromId: workflowStart.value,
			workflowEndToId: workflowEnd.value,
			departmentStructureType: structureType.value,
			canGrant: canGrant,
		};

		const { data } = await updateUserProject(params);

		if (data) {
			toast.success("Updated successfully");
		}
	};

	const backButtonClickHandler = () => {
		navigate(`${RoutePath.PROJECT}/${id}`);
	};

	console.log(userProject);

	return (
		<>
			{" "}
			<ShadowedContainer>
				<Button onClick={backButtonClickHandler}>
					{t("button.backToDetail", { framework: "React" })}
				</Button>
			</ShadowedContainer>
			<ProjectUserForm
				mode={"EDIT"}
				data={userProject}
				id={id!}
				heading={t("userProject.editUser", { framework: "React" })
					.replace(
						"_USER_",
						language !== "ar"
							? userProject?.user.name!
							: userProject?.user.nameEnglish!
					)
					.replace(
						"_PROJECT_",
						language !== "ar"
							? userProject?.project?.name!
							: userProject?.project?.nameEnglish!
					)}
				isNormalUser={isNormalUser}
				actionButtonText={t("button.update", { framework: "React" })}
				onActionButtonClick={updateUserProjectClickHandler}
			/>
		</>
	);
};

export default ProjectUserEditPage;
