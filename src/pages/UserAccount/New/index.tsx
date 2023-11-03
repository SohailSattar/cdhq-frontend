import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";
import {
	UserForm,
	IUserFormInputs,
	PageContainer,
	Modal,
	UserPreview,
} from "../../../components";

import { APINewUser, APIUserDetail } from "../../../api/users/types";
import { getExistingEmployee } from "../../../api/employees/get/getExistingEmployee";
import { checkIfUserExists } from "../../../api/users/get/checkIfUserExists";
import { addUser } from "../../../api/users/add/addUser";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";
import { Project } from "../../../data/projects";
import { checkPrivilegeForProjectUser } from "../../../api/userProjects/get/checkPrivilegeForProjectUser";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { APIPrivileges } from "../../../api/privileges/type";

const UserNewPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const { role } = useStore((state) => state.loggedInUser);
	const [canView, setCanView] = useState(false);

	const [employeeExists, setEmployeeExists] = useState(true);

	const [employee, setEmployee] = useState<APIUserDetail>();

	const [details, setDetails] = useState<IUserFormInputs>();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const previewHandler = async (values: IUserFormInputs) => {
		setDetails(values);
		setIsOpen(true);
	};

	const fetchDetails = useMemo(
		() => async () => {
			// check if user can get details
			const { data: privilege } = await getProjectPrivilege(
				Project.UserManagement
			);

			setPrivileges(privilege);
			if (!privilege?.insertPrivilege) {
				setCanView(false);
				return;
			} else {
				if (id) {
					// check if user has read or write privilege
					const { data: projectUserPrivilege } =
						await checkPrivilegeForProjectUser(id!, Project.UserManagement);

					// if (!projectUserPrivilege?.insertPrivilege) {
					// 	setCanView(false);
					// 	return;
					// }
					// What if doesnt have read privilege?

					const { data: isExist } = await checkIfUserExists(id!);

					if (isExist) {
						navigate(`${RoutePath.USER}/${id}/edit`);
					}

					const { data } = await getExistingEmployee(id!);

					if (data) {
						const {
							id,
							employeeNo: empNo,
							name,
							nameEnglish,
							phone,
							email,
							department,
							class: classDetail,
							rank,
						} = data;

						setEmployeeExists(true);

						setEmployee({
							id: id,
							logName: "",
							employeeNo: empNo!,
							name,
							nameEnglish,
							phone: phone!,
							email: email!,
							department: department!,
							class: classDetail!,
							rank: rank!,
							createdBy: "",
							createdOn: "",
							updatedBy: "",
							updatedOn: "",
						});
					}
				} else {
					setEmployeeExists(false);
				}
				setCanView(true);
			}

			// get the details.
		},
		[id, navigate]
	);

	useEffect(() => {
		// if (
		// 	(role === ROLE.USER || role === "" || role === ROLE.ADMIN) &&
		// 	(loggedUserId.toString() !== id || loggedUserId === 0)
		// ) {
		// 	navigate(RoutePath.USER);
		// } else {
		// 	setCanView(true);
		// }
		fetchDetails();
	}, [language, id, navigate, role, fetchDetails]);

	// useEffect(() => {
	// 	// if (role === ROLE.SUPERADMIN) {
	// 	// 	setCanView(true);
	// 	// }

	// 	const fetchData = async () => {
	// 		if (id) {
	// 			const { data: privilege } = await checkPrivilegeForProjectUser(
	// 				id!,
	// 				Project.UserManagement
	// 			);

	// 			if (privilege) {
	// 				const {
	// 					readPrivilege,
	// 					insertPrivilege,
	// 					updatePrivilege,
	// 					deletePrivilege,
	// 				} = privilege;

	// 				setPrivilege({
	// 					readPrivilege,
	// 					insertPrivilege,
	// 					updatePrivilege,
	// 					deletePrivilege,
	// 				});
	// 			}

	// 			const { data: isExist } = await checkIfUserExists(id!);

	// 			console.log(isExist);
	// 			if (isExist) {
	// 				navigate(`${RoutePath.USER}/${id}/edit`);
	// 			}

	// 			const { data } = await getExistingEmployee(id!);
	// 			if (data) {
	// 				const {
	// 					id,
	// 					employeeNo: empNo,
	// 					fullName: name,
	// 					nameEnglish,
	// 					phone,
	// 					email,
	// 					department,
	// 					class: classDetail,
	// 					rank,
	// 				} = data;

	// 				setEmployeeExists(true);

	// 				setEmployee({
	// 					id: id,
	// 					logName: "",
	// 					employeeNo: empNo!,
	// 					name,
	// 					nameEnglish,
	// 					phone: phone!,
	// 					email: email!,
	// 					department: department!,
	// 					class: classDetail!,
	// 					rank: rank!,
	// 					createdBy: "",
	// 					createdOn: "",
	// 					updatedBy: "",
	// 					updatedOn: "",
	// 				});
	// 			}
	// 		} else {
	// 			setEmployeeExists(false);
	// 		}
	// 	};

	// 	if (role === ROLE.SUPERADMIN || role === ROLE.ADMIN) {
	// 		fetchData();
	// 	}
	// }, [id, language, navigate, role]);

	const submitHandler = async () => {
		const {
			employeeNo,
			logName,
			name,
			nameEnglish,
			phone,
			email,
			department,
			userClass,
			rank,
			password,
		} = details!;

		const params: APINewUser = {
			...details,
			id: id!,
			employeeNo: employeeNo,
			logName: logName,
			name: name,
			nameEnglish: nameEnglish,
			phone: phone,
			email: email,
			departmentId: +department?.value!,
			classId: +userClass?.value!,
			rankId: +rank?.value!,
			password: password,
		};

		const { data } = await addUser(params);
		if (data?.success!) {
			toast.success(t("message.userAdded", { framework: "React" }).toString());
			if (id) {
				navigate(`${RoutePath.USER_EDIT.replace(RoutePath.ID, id!)}`);
			} else {
				navigate(
					`${RoutePath.USER_EDIT.replace(RoutePath.ID, data.id?.toString()!)}`
				);
			}
		}

		if (data?.errors?.length! > 0) {
			data?.errors?.map((error: any) =>
				toast.error(error, { autoClose: 5000 })
			);
		}
	};

	return (
		<PageContainer
			lockFor={[ROLE.USER]}
			showBackButton
			btnBackUrlLink={RoutePath.USER}
			displayContent={privileges?.insertPrivilege}>
			<UserForm
				data={employee}
				isExistingEmployee={employeeExists}
				isNewUser={true}
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={previewHandler}
			/>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<UserPreview
					data={details!}
					onClick={submitHandler}
				/>
			</Modal>
		</PageContainer>
	);
};

export default UserNewPage;
