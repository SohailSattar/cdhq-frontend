import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getExistingEmployees } from "../../../api/employees/get/getExistingEmployeesList";
import { APIEmployee } from "../../../api/employees/types";
import { checkIfUserExists } from "../../../api/users/get/checkIfUserExists";
import { getExistingUsers } from "../../../api/users/get/getExistingUsers";
import { APIExistingUser } from "../../../api/users/types";
import {
	Button,
	NotAuthorized,
	SearchBox,
	ShadowedContainer,
} from "../../../components";
import { Tab, TabList, TabPanel, Tabs } from "../../../components/Tabs";
import ExistingEmployeeDetailsSection from "./containers/ExistingEmployeeDetailsSection";
import ExistingUserDetailsSection from "./containers/ExistingUserDetailsSection";
import MessageBox from "./containers/MessageBox";

import { useStore } from "../../../utils/store";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";

import styles from "./styles.module.scss";

const SearchUserPage = () => {
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const { role } = useStore((state) => state.loggedInUser);

	const [canView, setCanView] = useState(false);

	const [existingEmployees, setExistingEmployees] = useState<APIEmployee[]>([]);
	const [existingUsers, setExistingUsers] = useState<APIExistingUser[]>([]);

	useEffect(() => {
		if (role === ROLE.SUPERADMIN) {
			setCanView(true);
		}
	}, [role]);

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
		<div className={styles.newUser}>
			<div className={styles.field}>
				<SearchBox
					label={t("user.employeeNumber", { framework: "React" })}
					onClick={employeeSearchHandler}
				/>
			</div>
			<Tabs>
				<TabList>
					<Tab>
						{t("employee.names", { framework: "React" })} (
						{existingEmployees.length})
					</Tab>
					<Tab>
						{t("user.names", { framework: "React" })} ({existingUsers.length})
					</Tab>
				</TabList>
				<TabPanel>
					<ShadowedContainer>
						<ExistingEmployeeDetailsSection
							list={existingEmployees}
							onClick={existingEmployeeClickHandler}
						/>
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					<ShadowedContainer>
						<MessageBox
							message={t("message.noUserInList", { framework: "React" })}
							type={"primary"}
						/>
						<Button onClick={newUserClickHandler}>
							{t("button.addNewUser", { framework: "React" })}
						</Button>
					</ShadowedContainer>
					<ShadowedContainer className={styles.container}>
						<ExistingUserDetailsSection
							list={existingUsers}
							onClick={(e) => existingUserEditClickHandler(e)}
						/>
					</ShadowedContainer>
				</TabPanel>
			</Tabs>
		</div>
	) : (
		<NotAuthorized />
	);
};

export default SearchUserPage;
