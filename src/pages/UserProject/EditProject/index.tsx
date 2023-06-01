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
	APIUserProjectPrivilege,
} from "../../../api/userProjects/types";
import { Id, ROLE } from "../../../utils";
import UserProjectPreview from "../../../components/Preview/UserProject";
import { getMyRole } from "../../../api/users/get/getMyRole";
import { checkPrivilegeForProjectUser } from "../../../api/userProjects/get/checkPrivilegeForProjectUser";

import { APIPrivilege, APIPrivileges } from "../../../api/privileges/type";
import SetPrivilege from "../../UserAccount/components/SetPrivilege";
import { Project } from "../../../data/projects";
import { APIUserRole } from "../../../api/users/types";
const UserProjectEditPage = () => {
	const { userId, userProjectId } = useParams<{
		userId: string;
		userProjectId: string;
	}>();

	const [t] = useTranslation("common");

	const navigate = useNavigate();

	// const { role, userName } = useStore((state) => state.loggedInUser);
	const language = useStore((state) => state.language);

	const [heading, setHeading] = useState("");

	const [userProject, setUserProject] = useState<APIUserProjectDetail>();
	const [privilege, setPrivilege] = useState<APIPrivileges>();

	const [isNormalUser, setIsNormalUser] = useState(true);
	const [showCard, setShowCard] = useState<boolean>(false);

	const [myRole, setMyRole] = useState<APIUserRole>();

	// 	useEffect(() => {
	// const

	// 	},[])

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getUserProject(userProjectId!);
			if (data) {
				setUserProject((prevState) => data);

				const userName =
					language !== "ar" ? data?.user.name! : data?.user.nameEnglish!;

				const { data: privilege } = await checkPrivilegeForProjectUser(
					data.user.id,
					data.project.id
				);
				if (privilege) {
					const {
						readPrivilege,
						insertPrivilege,
						updatePrivilege,
						deletePrivilege,
					} = privilege;

					setPrivilege({
						readPrivilege,
						insertPrivilege,
						updatePrivilege,
						deletePrivilege,
					});
				}

				setHeading(
					t("message.userProjectEdit", { framework: "React" }) + "" + userName
				);

				const { data: myRole } = await getMyRole();
				if (data) {
				}

				if (myRole?.role.name !== ROLE.SUPERADMIN) {
					if (privilege?.readPrivilege) {
						if (data.project.id === Project.UserManagement) {
							setShowCard(true);
						} else {
							setShowCard(false);
						}
					} else {
						setShowCard(true);
					}
				} else {
					setShowCard(false);
				}
			}
		};

		fetchData();
	}, [language, t, userId, navigate, userProjectId, setUserProject]);

	const updateUserProjectClickHandler = async (
		formInput: IUserProjectFormInputs
	) => {
		const params: APIUpdateUserProjectDetail = {
			id: userProjectId!,
			privilegeId: formInput.privilege.value!.toString(),
			departmentId: formInput.department?.value!!,
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
			lockFor={[ROLE.USER]}
			showBackButton
			btnBackLabel={t("button.backToDetail", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.USER}/${userId}`}>
			{!showCard ? (
				<UserProjectForm
					id={userProjectId}
					title={heading}
					disableProject={true}
					actionButtonText={t("button.update", { framework: "React" })}
					onActionButtonClick={updateUserProjectClickHandler}
				/>
			) : (
				<UserProjectPreview data={userProject!} />
			)}
		</PageContainer>
	);
};

export default UserProjectEditPage;
