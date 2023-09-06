import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getExistingEmployees } from "../../../api/employees/get/getExistingEmployeesList";
import { APIEmployee, APIExistingEmployee } from "../../../api/employees/types";
import { checkIfUserExists } from "../../../api/users/get/checkIfUserExists";
import { getExistingUsers } from "../../../api/users/get/getExistingUsers";
import { APIExistingUser } from "../../../api/users/types";
import {
	Button,
	NotAuthorized,
	PageContainer,
	SearchBox,
	ShadowedContainer,
} from "../../../components";
import ExistingEmployeeDetailsSection from "./containers/ExistingEmployeeDetailsSection";
import ExistingUserDetailsSection from "./containers/ExistingUserDetailsSection";
import MessageBox from "./containers/MessageBox";

import { useStore } from "../../../utils/store";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";

import styles from "./styles.module.scss";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const UserSearchPage = () => {
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const { role } = useStore((state) => state.loggedInUser);

	const [canView, setCanView] = useState(false);
	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [existingEmployees, setExistingEmployees] = useState<
		APIExistingEmployee[]
	>([]);
	const [existingUsers, setExistingUsers] = useState<APIExistingUser[]>([]);

	useEffect(() => {
		const displayForm = async () => {
			if (role === ROLE.USER) {
				setCanView(false);
				return;
			}

			const { data: privilege } = await getProjectPrivilege(
				Project.UserManagement
			);

			if (privilege) {
				const {
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivileges({
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});

				if (readPrivilege) {
					setCanView(true);
				}
			}

			if (role === ROLE.SUPERADMIN) {
				setCanView(true);
			}
		};

		displayForm();
	}, [role, setPrivileges]);

	const employeeSearchHandler = (employeeNumber: string) => {
		const fetchEmployeeData = async () => {
			const { data } = await getExistingEmployees(employeeNumber);

			if (data) {
				setExistingEmployees(data);
			}
		};

		const fetchUserData = async () => {
			const { data, error } = await getExistingUsers(employeeNumber);

			if (data) {
				setExistingUsers(data);
			}

			if (error) {
				setExistingUsers([]);
			}
		};

		fetchEmployeeData();
		fetchUserData();
	};

	const existingEmployeeClickHandler = async (employee: APIEmployee) => {
		const id = employee?.id!.toString();

		const { data } = await checkIfUserExists(id);
		if (data) {
			navigate(`${RoutePath.USER}/${id}/edit`);
		} else {
			navigate(`${RoutePath.USER}/new/${id}`);
		}
	};

	const newUserClickHandler = () => {
		navigate(`${RoutePath.USER}/new`);
	};

	const existingUserEditClickHandler = (e: any) => {
		const { id } = e;
		navigate(`${RoutePath.USER}/${id}/edit`);
	};

	return canView ? (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.USER}
			className={styles.newUser}>
			<div className={styles.field}>
				<SearchBox
					label={t("user.employeeNumber", { framework: "React" })}
					onClick={employeeSearchHandler}
				/>
			</div>
			<ShadowedContainer>
				<ExistingEmployeeDetailsSection
					list={existingEmployees}
					onClick={existingEmployeeClickHandler}
				/>
			</ShadowedContainer>{" "}
			<ShadowedContainer className={styles.container}>
				<ExistingUserDetailsSection
					list={existingUsers}
					onClick={(e) => existingUserEditClickHandler(e)}
				/>
			</ShadowedContainer>{" "}
			{privileges?.insertPrivilege && (
				<ShadowedContainer>
					<MessageBox
						message={t("message.noUserInList", { framework: "React" })}
						type={"primary"}
					/>
					<Button onClick={newUserClickHandler}>
						{t("button.addNewUser", { framework: "React" })}
					</Button>
				</ShadowedContainer>
			)}
		</PageContainer>
	) : (
		<NotAuthorized />
	);
};

export default UserSearchPage;
