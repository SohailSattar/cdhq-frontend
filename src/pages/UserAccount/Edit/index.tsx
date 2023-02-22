import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccessRoles } from "../../../api/roles/get/getAccessRoles";
import { getUserDetail } from "../../../api/users/get/getUserDetail";
import { updatePassword } from "../../../api/users/update/updatePassword";
import { updateRole } from "../../../api/users/update/updateRole";
import {
	AuthorizedContainer,
	RedirectButton,
	ShadowedContainer,
	// UserForm,
	UserProjectTable,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { Tab, TabList, TabPanel, Tabs } from "../../../components/Tabs";
import { useStore } from "../../../utils/store";
import ChangePassword from "./containers/ChangePassword";
import RoleAssignment from "./containers/RoleAssignment";

import { updateUser } from "../../../api/users/update/updateUser";
import { APIUpdateUser, APIUserDetail } from "../../../api/users/types";

import { APIRole } from "../../../api/roles/types";
import { checkIfEmployeeExists } from "../../../api/employees/get/checkIfEmployeeExists";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";
import UserForm from "../../../components/Form/UserForm";
import {
	IPasswordFormInputs,
	IUserFormInputs,
} from "../../../components/Form/types";

import styles from "./styles.module.scss";
import { updateUserProjectStatus } from "../../../api/userProjects/update/updateUserProjectStatus";
import { APIProjectStatus } from "../../../api/userProjects/types";

const EditUserPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const { id: loggedUserId, role } = useStore((state) => state.loggedInUser);

	const [canView, setCanView] = useState(true);

	const [isExistingEmployee, setIsExistingEmployee] = useState(true);

	const [useDetail, setUserDetail] = useState<APIUserDetail>();

	// User Roles
	const [roles, setRoles] = useState<APIRole[]>([]);
	const [roleDropdownOptions, setRoleDropdownOptions] = useState<
		DropdownOption[]
	>([]);
	const [selectedRoleOption, setSelectedRoleOption] =
		useState<DropdownOption>();

	useEffect(() => {
		if (
			(role === ROLE.USER || role === "" || role === ROLE.ADMIN) &&
			(loggedUserId.toString() !== id || loggedUserId === 0)
		) {
			navigate(RoutePath.USER);
		} else {
			setCanView(true);
		}

		const fetchData = async () => {
			const { data, error } = await getUserDetail(id!);

			if (error) {
				if (error.request.status === 401) {
					navigate(RoutePath.LOGIN);
				}
			}

			if (data) {
				setUserDetail(data);

				const { data: isExist } = await checkIfEmployeeExists(data?.id!);

				if (data.role) {
					setSelectedRoleOption({
						value: data.role?.id!,
						label: data?.role?.name!,
					});
				}

				setIsExistingEmployee(isExist!);
			} else {
				navigate(`${RoutePath.USER}/${loggedUserId}`);
			}
		};

		fetchData();
	}, [language, id, navigate, role, loggedUserId]);

	useEffect(() => {
		const fetchData = async () => {
			if (role === ROLE.SUPERADMIN) {
				const { data } = await getAccessRoles();

				if (data) {
					setRoles(data);
				}
			}
		};

		fetchData();
	}, [role]);

	useEffect(() => {
		setRoleDropdownOptions(
			roles.map((role) => ({ label: role.name, value: role.id }))
		);
	}, [roles]);

	// User Details tab
	const updateDetailsClickHandler = async (values: IUserFormInputs) => {
		const {
			logName,
			name,
			nameEnglish,
			phone,
			email,
			department,
			userClass,
			rank,
		} = values;

		const params: APIUpdateUser = {
			id: +id!,
			logName: logName,
			name: name,
			nameEnglish: nameEnglish,
			phone: phone,
			email: email,
			departmentId: department.value!.toString()!,
			classId: userClass.value!.toString()!,
			rankId: rank.value!.toString()!,
		};

		const { data, error } = await updateUser(params);
		if (data?.success!) {
			toast.success(
				t("message.userDetailUpdated", { framework: "React" }).toString()
			);
		} else {
			error?.map((err: any) => toast.error(err, { autoClose: false }));
		}
	};

	// Update Password Tab

	const updatePasswordClickHandler = async (values: IPasswordFormInputs) => {
		const params = {
			userId: id!,
			password: values.password,
		};

		const { data } = await updatePassword(params);

		if (data) {
			toast.success(
				t("message.passwordUpdated", { framework: "React" }).toString()
			);
		}
	};

	// const isAdmin = false;

	const roleSelectHandler = (option: DropdownOption) => {
		setSelectedRoleOption(option);
	};

	const roleAssignmentButtonClickHandler = () => {
		const params = {
			userId: id!.toString(),
			roleId: selectedRoleOption?.value!.toString()!,
		};
		updateRole(params);
		toast.success(t("message.roleUpdated", { framework: "React" }).toString());
	};

	const activateUserProjectClickHandler = async (userProjectId: string) => {
		const params: APIProjectStatus = {
			id: userProjectId,
			statusId: 1,
		};

		const { data } = await updateUserProjectStatus(params);
		if (data) {
			toast.success(
				t("message.projectActivated", { framework: "React" }).toString()
			);
		}
	};

	const editUserProjectClickHandler = (projectId: string) => {
		navigate(`${RoutePath.USER}/${id}/project/${projectId}/edit`);
	};

	const deleteUserProjectClickHandler = (projectId: string) => {};

	return (
		<AuthorizedContainer isAuthorized={canView}>
			<ShadowedContainer>
				<RedirectButton
					label={t("button.backToDetail", { framework: "React" })}
					redirectTo={`${RoutePath.USER}/${id}`}
				/>
			</ShadowedContainer>
			<Tabs>
				<TabList>
					<Tab>{t("user.basicDetails", { framework: "React" })} </Tab>
					<Tab>{t("project.projects", { framework: "React" })}</Tab>
					{role === ROLE.SUPERADMIN && (
						<>
							<Tab>{t("form.changePassword", { framework: "React" })}</Tab>
							<Tab>{t("user.assignRole", { framework: "React" })}</Tab>
						</>
					)}
				</TabList>
				<TabPanel>
					<ShadowedContainer>
						<UserForm
							isExistingEmployee={isExistingEmployee}
							hideActionButton={isExistingEmployee}
							data={useDetail}
							actionButtonText={t("button.update", { framework: "React" })}
							onSubmit={updateDetailsClickHandler}
						/>
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					{(role === ROLE.SUPERADMIN || role === ROLE.ADMIN) && (
						<ShadowedContainer className={styles.btnSection}>
							<RedirectButton
								label={t("button.assignProject", { framework: "React" })}
								redirectTo={`${RoutePath.USER}/${id}/project/assign`}
							/>
						</ShadowedContainer>
					)}
					<UserProjectTable
						id={id!}
						displayActionsColumn={true}
						onActivateButtonClick={activateUserProjectClickHandler}
						onEditButtonClick={editUserProjectClickHandler}
						onDeleteButtonClick={deleteUserProjectClickHandler}
					/>
				</TabPanel>
				{role === ROLE.SUPERADMIN && (
					<>
						<TabPanel>
							<ShadowedContainer>
								<ChangePassword onClick={updatePasswordClickHandler} />
							</ShadowedContainer>
						</TabPanel>

						<TabPanel>
							<RoleAssignment
								selectedRoleOption={selectedRoleOption}
								roleOptions={roleDropdownOptions}
								onRoleSelect={roleSelectHandler}
								onRoleAssignmentButtonClick={roleAssignmentButtonClickHandler}
							/>
						</TabPanel>
					</>
				)}
			</Tabs>
		</AuthorizedContainer>
	);
};

export default EditUserPage;
