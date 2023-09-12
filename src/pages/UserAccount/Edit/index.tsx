import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccessRoles } from "../../../api/roles/get/getAccessRoles";
import { getUserDetail } from "../../../api/users/get/getUserDetail";
import { updatePassword } from "../../../api/users/update/updatePassword";
import { updateRole } from "../../../api/users/update/updateRole";
import {
	DeleteConfirmation,
	IEmployeeSignatureFormInputs,
	MetaDataDetails,
	PageContainer,
	RedirectButton,
	ShadowedContainer,
	Status,
	// UserForm,
	UserProjectTable,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { Tab, TabList, TabPanel, Tabs } from "../../../components/Tabs";
import { useStore } from "../../../utils/store";
import ChangePassword from "./containers/ChangePassword";
import RoleAssignment from "./containers/RoleAssignment";

import { updateUser } from "../../../api/users/update/updateUser";
import {
	APIUpdateUser,
	APIUpdateUserStatus,
	APIUserDetail,
} from "../../../api/users/types";

import { APIRole } from "../../../api/roles/types";
import { checkIfEmployeeExists } from "../../../api/employees/get/checkIfEmployeeExists";

import * as RoutePath from "../../../RouteConfig";

import { Id, ROLE } from "../../../utils";
import {
	UserForm,
	IPasswordFormInputs,
	IUserFormInputs,
} from "../../../components";

import styles from "./styles.module.scss";
import { updateUserStatus } from "../../../api/users/update/updateUserStatus";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { APIPrivilege, APIPrivileges } from "../../../api/privileges/type";
import { checkPrivilegeForProjectUser } from "../../../api/userProjects/get/checkPrivilegeForProjectUser";
import { Project } from "../../../data/projects";
import { APIUserProjectPrivilege } from "../../../api/userProjects/types";
import SignatureManagement from "./containers/SignatureManagement";
import {
	APIEmployeeSignature,
	APIUpdateEmployeeSignature,
} from "../../../api/employees/types";
import { getEmployeeSignature } from "../../../api/employees/get/getEmployeeSignature";
import { updateEmployeeSignature } from "../../../api/employees/update/updateEmployeeSignature";

const UserEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const { id: loggedUserId, role } = useStore((state) => state.loggedInUser);

	const [showModal, setShowModal] = useState(false);

	const [isExistingEmployee, setIsExistingEmployee] = useState(true);

	const [userDetail, setUserDetail] = useState<APIUserDetail>();

	const [status, setStatus] = useState<APIActiveStatus>();

	const [privilege, setPrivilege] = useState<APIPrivileges>();

	const [signature, setSignature] = useState<APIEmployeeSignature>();
	const [canViewSignature, setCanViewSignature] = useState<boolean>(false);

	// User Roles
	const [roles, setRoles] = useState<APIRole[]>([]);
	const [roleDropdownOptions, setRoleDropdownOptions] = useState<
		DropdownOption[]
	>([]);
	const [selectedRoleOption, setSelectedRoleOption] =
		useState<DropdownOption>();

	console.log(role);

	useEffect(() => {
		// if (
		// 	(role === ROLE.USER || role === "" || role === ROLE.ADMIN) &&
		// 	(loggedUserId.toString() !== id || loggedUserId === 0)
		// ) {
		// 	navigate(RoutePath.USER);
		// } else {
		// 	setCanView(true);
		// }

		const fetchData = async () => {
			const { data: privilege } = await checkPrivilegeForProjectUser(
				id!,
				Project.UserManagement
			);

			if (privilege) {
				const {
					privilegeId,
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivilege({
					privilegeId,
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});

				if (privilege?.readPrivilege) {
					const { data, error } = await getUserDetail(id!);

					if (error) {
						if (error.request.status === 401) {
							navigate(RoutePath.LOGIN);
						}
					}

					if (data) {
						setUserDetail(data);
						setStatus(data.activeStatus);

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
				}
			}
		};
		if (id) {
			fetchData();
		}
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
			toast.error(error, { autoClose: false });
			// error?.map((err: any) => toast.error(err, { autoClose: false }));
		}
	};

	const activateButtonClickHandler = async () => {
		const statusCode = 1;

		const params: APIUpdateUserStatus = {
			userId: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateUserStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(
			t("message.userActivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 9;

		const params: APIUpdateUserStatus = {
			userId: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateUserStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}
		}

		toast.error(
			t("message.userDeactivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	// Update Password Tab

	const updatePasswordClickHandler = async (values: IPasswordFormInputs) => {
		const params = {
			userId: id!,
			password: values.password,
		};

		const { data, error } = await updatePassword(params);

		if (error) {
			toast.error(error.ErrorMessage);
		}

		if (data) {
			toast.success(
				t("message.passwordUpdated", { framework: "React" }).toString()
			);
		}
	};

	// const isAdmin = false;

	const fetchSignature = useCallback(
		async (empId: string) => {
			if (role === ROLE.USER) {
				setCanViewSignature(false);
				return;
			} else if (role === ROLE.SUPERADMIN || role === ROLE.ADMIN) {
				console.log(role);

				const { data: signPrivilege, error } =
					await checkPrivilegeForProjectUser(id!, Project.Signature);

				if (error) {
					setCanViewSignature(false);
				} else {
					if (signPrivilege) {
						setCanViewSignature(signPrivilege.updatePrivilege);
					}
					if (signPrivilege?.updatePrivilege === true) {
						const { data } = await getEmployeeSignature(empId);
						if (data) {
							setSignature(data);
						}
					}
				}
			}
		},
		[id, role]
	);

	useEffect(() => {
		if (id) {
			fetchSignature(id!);
		}
	}, [fetchSignature, id]);

	const submitSignatureHandler = async (
		values: IEmployeeSignatureFormInputs
	) => {
		const { thumbnail } = values;

		const params: APIUpdateEmployeeSignature = {
			id: id!,
			thumbnail: thumbnail!,
		};

		const { data } = await updateEmployeeSignature(params);

		if (data) {
			toast.success(
				t("message.signatureUpdated", { framework: "React" }).toString()
			);
		}
	};

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

	// const activateUserProjectClickHandler = async (userProjectId: string) => {
	// 	const params: APIProjectStatus = {
	// 		id: userProjectId,
	// 		statusId: 1,
	// 	};

	// 	const { data } = await updateUserProjectStatus(params);
	// 	if (data) {
	// 		toast.success(
	// 			t("message.projectActivated", { framework: "React" }).toString()
	// 		);
	// 	}
	// };

	const editUserProjectClickHandler = (projectId: string) => {
		navigate(`${RoutePath.USER}/${id}/project/${projectId}/edit`);
	};

	const deleteUserProjectClickHandler = (projectId: string) => {
		// TODO - Add logic
	};

	return (
		<PageContainer
			title={t("page.userEdit", { framework: "React" })}
			showBackButton
			btnBackLabel={t("button.backToDetail", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.USER}/${id}`}
			showChangeStatusButton={
				privilege?.privilegeId !== 999 && privilege?.updatePrivilege
			}
			currentStatus={status?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			onActivate={activateButtonClickHandler}
			onDectivate={deleteButtonClickHandler}
			displayContent={privilege?.readPrivilege!}>
			{/* <Status status={status!} /> */}
			<ShadowedContainer>
				<div>
					{userDetail?.employeeNo}{" "}
					{language !== "ar"
						? userDetail?.rank?.name!
						: userDetail?.rank?.nameEnglish!}{" "}
					{language !== "ar" ? userDetail?.name! : userDetail?.nameEnglish!}
				</div>
			</ShadowedContainer>
			<Tabs>
				<TabList>
					<Tab>{t("user.basicDetails", { framework: "React" })} </Tab>
					<Tab>{t("project.projects", { framework: "React" })}</Tab>
					{privilege?.updatePrivilege && (
						<Tab>{t("form.changePassword", { framework: "React" })}</Tab>
					)}
					{(role === ROLE.SUPERADMIN || canViewSignature === true) && (
						<>
							<Tab>{t("employee.signature", { framework: "React" })}</Tab>
						</>
					)}
					{role === ROLE.SUPERADMIN && (
						<>
							<Tab>{t("user.assignRole", { framework: "React" })}</Tab>
						</>
					)}
				</TabList>
				<TabPanel>
					<ShadowedContainer>
						<UserForm
							isExistingEmployee={false}
							hideActionButton={
								!privilege?.updatePrivilege ?? isExistingEmployee
							}
							data={userDetail}
							lockFields={privilege?.privilegeId === 999}
							actionButtonText={t("button.update", { framework: "React" })}
							onSubmit={updateDetailsClickHandler}
						/>
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					{(role === ROLE.SUPERADMIN ||
						//
						(role === ROLE.ADMIN && privilege?.privilegeId !== 999)) && (
						<ShadowedContainer className={styles.btnSection}>
							<RedirectButton
								label={t("button.assignProject", { framework: "React" })}
								redirectTo={`${RoutePath.USER}/${id}/project/assign`}
							/>
						</ShadowedContainer>
					)}
					<UserProjectTable
						id={id!}
						displayActionsColumn={privilege?.privilegeId !== 999 && true}
						onEditButtonClick={editUserProjectClickHandler}
						onDeleteButtonClick={deleteUserProjectClickHandler}
					/>
				</TabPanel>
				{privilege?.updatePrivilege && (
					<TabPanel>
						<ShadowedContainer>
							<ChangePassword onClick={updatePasswordClickHandler} />
						</ShadowedContainer>
					</TabPanel>
				)}
				{(role === ROLE.SUPERADMIN || canViewSignature === true) && (
					<>
						<TabPanel>
							<SignatureManagement
								data={signature!}
								onSubmit={submitSignatureHandler}
							/>
						</TabPanel>
					</>
				)}

				{role === ROLE.SUPERADMIN && (
					<>
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
			<hr />
			<MetaDataDetails
				createdBy={userDetail?.createdBy!}
				createdOn={userDetail?.createdOn!}
				updatedBy={userDetail?.updatedBy}
				updatedOn={userDetail?.updatedOn}
			/>
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default UserEditPage;
