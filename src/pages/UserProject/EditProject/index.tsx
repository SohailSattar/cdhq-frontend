import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	IUserProjectFormInputs,
	MetaDataDetails,
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
import { ROLE } from "../../../utils";
import UserProjectPreview from "../../../components/Preview/UserProject";
import { getMyRole } from "../../../api/users/get/getMyRole";
import { checkPrivilegeForProjectUser } from "../../../api/userProjects/get/checkPrivilegeForProjectUser";

import { APIPrivileges } from "../../../api/privileges/type";
import { Project } from "../../../data/projects";
import { deleteProject } from "../../../api/users/delete/deleteProject";
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

	const [showCard, setShowCard] = useState<boolean>(false);

	// 	useEffect(() => {
	// const

	// 	},[])

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getUserProject(userProjectId!);
			if (data) {
				setUserProject(() => data);

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
		if (userProjectId) {
			fetchData();
		}
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
			canExportExcel: formInput.canExportExcel,
			canExportPdf: formInput.canExportPdf,
		};

		const { data, error } = await updateUserProject(params);

		if (error) {
			toast.error(error.ErrorMessage);
		}

		if (data) {
			toast.success("Updated successfully");
		}
	};

	const deleteUserProjectClickHandler = async () => {
		if (userProjectId !== "") {
			const { data, error } = await deleteProject(userProjectId!);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				toast.success("Deleted successfully");
				navigate(`${RoutePath.USER_EDIT.replace(RoutePath.ID, userId!)}`);
			}
		}
	};

	return (
		<PageContainer
			lockFor={[ROLE.USER]}
			showBackButton
			displayContent={privilege?.updatePrivilege}
			// TO DO - ADD LOGIC
			btnBackLabel={t("button.back", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.USER_EDIT.replace(RoutePath.ID, userId!)}`}>
			{!showCard ? (
				<UserProjectForm
					id={userProjectId}
					title={heading}
					disableProject={true}
					actionButtonText={t("button.update", { framework: "React" })}
					onActionButtonClick={updateUserProjectClickHandler}
					onDelete={deleteUserProjectClickHandler}
				/>
			) : (
				<UserProjectPreview data={userProject!} />
			)}
			<MetaDataDetails
				createdBy={userProject?.createdBy!}
				createdOn={userProject?.createdOn!}
				updatedBy={userProject?.updatedBy!}
				updatedOn={userProject?.updatedOn}
			/>
		</PageContainer>
	);
};

export default UserProjectEditPage;
