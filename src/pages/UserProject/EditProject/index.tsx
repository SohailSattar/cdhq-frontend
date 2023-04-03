import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	Button,
	ShadowedContainer,
	UserProjectForm,
} from "../../../components";
import { useStore } from "../../../utils/store";

import { getUserProject } from "../../../api/userProjects/get/getUserProject";
import { updateUserProject } from "../../../api/userProjects/update/updateUserProject";

import * as RoutePath from "../../../RouteConfig";
import { IUserProjectFormInputs } from "../../../components/Form/types";
import {
	APIUpdateUserProjectDetail,
	APIUserProjectDetail,
} from "../../../api/userProjects/types";
import { Id } from "../../../utils";

const EditUserProjectPage = () => {
	const { userId, userProjectId } =
		useParams<{ userId: string; userProjectId: string }>();

	const [t] = useTranslation("common");

	const navigate = useNavigate();

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

				// Can Grant
				if (data?.user.roleId === 0 || data?.user.roleId === 3) {
					setIsNormalUser(true);
				} else {
					setIsNormalUser(false);
				}
			}
		};

		fetchData();
	}, [language, t, userId, navigate, userProjectId]);

	const updateUserProjectClickHandler = async (
		formInput: IUserProjectFormInputs
	) => {
		let departId: Id = 0;
		departId = formInput.department?.value!;

		if (formInput.center) {
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

		const { data } = await updateUserProject(params);

		if (data) {
			toast.success("Updated successfully");
		}
	};

	const backButtonClickHandler = () => {
		navigate(`${RoutePath.USER}/${userId}`);
	};

	return (
		<>
			<ShadowedContainer>
				<Button onClick={backButtonClickHandler}>
					{t("button.backToDetail", { framework: "React" })}
				</Button>
			</ShadowedContainer>
			<UserProjectForm
				isNormalUser={isNormalUser}
				title={heading}
				data={userProject}
				disableProject={true}
				actionButtonText={t("button.update", { framework: "React" })}
				onActionButtonClick={updateUserProjectClickHandler}
			/>
		</>
	);
};

export default EditUserProjectPage;
