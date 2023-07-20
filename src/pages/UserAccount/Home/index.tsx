import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../../api/users/get/getUsers";
import {
	ActionButtons,
	ActiveStatus,
	Button,
	DepartmentTree,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import { getUsersByKeyword } from "../../../api/users/get/getUsersByKeyword";
import { DropdownOption } from "../../../components/Dropdown";

import { useStore } from "../../../utils/store";

import { getUsersByDepartments } from "../../../api/users/get/getUsersByDepartments";
import { APIUserName } from "../../../api/users/types";

import * as RoutePath from "../../../RouteConfig";

import { Id, ROLE } from "../../../utils";

import { Column } from "react-table";
import { UserColumns } from "../../../components/PaginatedTable/types";

import styles from "./styles.module.scss";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { APIRole } from "../../../api/roles/types";
import { getRole } from "../../../api/users/get/getRole";
import { getMyRole } from "../../../api/users/get/getMyRole";

const UserAccountPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	// const { role } = useStore((state) => state.loggedInUser);
	const [role, setRole] = useState<APIRole>();

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [users, setUsers] = useState<APIUserName[]>([]);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);

	const [selectedRole, setSelectedRole] = useState<Id>();
	const [selectedProject, setSelectedProject] = useState<Id>();
	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();
	const [orderBy, setOrderBy] = useState<string>("");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	// const [departmentIdsTemp, setDepartmentIdsTemp] = useState<string[]>([]);
	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMyRole();
			if (data) {
				setRole(data.role!);
			}
		};

		fetch();
	}, []);

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
			if (role?.name !== ROLE.SUPERADMIN) {
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
				}
			}
		};

		fetch();
	}, [setPrivileges]);

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const logName = t("user.logName", { framework: "React" });
	const fullName = t("user.fullName", { framework: "React" });

	const department = t("department.name", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });

	const columns: Column<UserColumns>[] = useMemo(
		() => [
			{
				Header: id,
				id: "id",
				accessor: (p) => p.id,
				Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			},
			{
				Header: employeeNo,
				id: "employeeNo",
				accessor: (p) => p.employeeNo,
				Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			},
			{
				Header: logName,
				id: "logName",
				accessor: (p) => p.logName,
				Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			},
			{
				Header: fullName,
				id: "name",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{value.name}</div>
						<div className={styles.english}>{value.nameEnglish}</div>
					</div>
				),
			},
			{
				Header: <div className={styles.tableHeaderCell}>{department}</div>,
				id: "departmentId",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{value.department && (
							<>
								<div className={styles.arabic}>{value.department.name}</div>
								<div className={styles.english}>
									{value.department.nameEnglish}
								</div>
							</>
						)}
					</div>
				),
			},
			{
				Header: status,
				id: "activeStatus",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActiveStatus
						code={value.activeStatus.id}
						text={
							language !== "ar"
								? value.activeStatus.nameArabic
								: value.activeStatus.nameEnglish
						}
					/>
				),
			},
			{
				Header: <div className={styles.tableHeaderCell}>{actions}</div>,
				id: "actions",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={""}
						showView={true}
						detailPageLink={`${RoutePath.USER}/${value.id}`}
						editPageLink={`${RoutePath.USER}/${value.id}/edit`}
					/>
				),
			},
		],
		[actions, employeeNo, fullName, id, logName, role]
	);

	// New maybe
	const fetch = useMemo(
		() => async () => {
			const { data, error } = await getUsers(
				currentPage,
				pageSize,
				keyword,
				selectedProject,
				selectedStatusCode,
				selectedRole,
				orderBy
			);

			console.log(currentPage);

			if (error?.response!.status! === 401) {
				navigate(RoutePath.LOGIN);
			} else if (error?.response!.status! === 403) {
				return;
			}

			if (data) {
				setUsers(data.users);
				setTotalCount(data.totalItems);
			}
		},
		[
			navigate,
			currentPage,
			pageSize,
			keyword,
			selectedRole,
			selectedProject,
			selectedStatusCode,
			orderBy,
		]
	);

	const fetchByDepartment = useMemo(
		() => async () => {
			const { data } = await getUsersByDepartments(
				1,
				10,
				departmentIds,
				keyword,
				selectedRole,
				selectedProject,
				selectedStatusCode,
				orderBy
			);

			if (data) {
				setUsers(data?.users);
				setTotalCount(data?.totalItems);
			}
		},
		[
			departmentIds,
			keyword,
			selectedRole,
			selectedProject,
			selectedStatusCode,
			orderBy,
		]
	);

	useEffect(() => {
		if (role?.name !== ROLE.USER) {
			if (departmentIds.length === 0) {
				fetch();
			} else {
				fetchByDepartment();
			}
		}
	}, [fetch, fetchByDepartment]);

	const userSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		let orderByParam = "";
		setToggleSort(!toggleSort);
		if (toggleSort) {
			orderByParam = `&OrderBy=${columnId}`;
		} else {
			orderByParam = `&OrderByDesc=${columnId}`;
		}
		setOrderBy(orderByParam);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
		// fetchData(currentpage);
	};

	const departmentNodeCheckHandler = (ids: any) => {
		setDepartmentIds(ids);
	};

	// const fetchUsersByDepartment = useMemo(
	// 	() => async () => {
	// 		const { data } = await getUsersByDepartments(1, 10, departmentIds);

	// 		if (data) {
	// 			setUsers(data?.users);
	// 			setTotalCount(data?.totalItems);
	// 		}
	// 	},
	// 	[departmentIds]
	// );

	const filterByDepartmentClickHandler = () => {
		if (departmentIds.length > 0) {
			fetchByDepartment();
		} else {
			fetch();
		}
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const roleSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			setSelectedRole(option?.value!);
		},
		[]
	);

	const projectSelectionHandler = useMemo(
		() => (option: DropdownOption) => {
			setSelectedProject(option?.value!);
		},
		[]
	);

	const statusSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			if (option) {
				setSelectedStatusCode((prevState) => (prevState = option?.value!));
			} else {
				setSelectedStatusCode("");
			}
		},
		[]
	);

	return (
		<PageContainer
			lockFor={[ROLE.USER]}
			displayContent={privileges?.readPrivilege!}
			title={t("page.userHome", { framework: "React" })}
			className={styles.userList}
			showAddButton={privileges?.insertPrivilege!}
			btnAddLabel={t("button.addNewUser", { framework: "React" })}
			btnAddUrlLink={RoutePath.USER_SEARCH}>
			<div className={styles.content}>
				<div>
					<ShadowedContainer
						className={language === "ar" ? styles.filterLTR : styles.filter}>
						<Button onClick={filterByDepartmentClickHandler}>
							{t("filter.byDepartment", { framework: "React" })}
						</Button>
					</ShadowedContainer>
					<ShadowedContainer
						className={
							language === "ar" ? styles.hierarchyLTR : styles.hierarchy
						}>
						<DepartmentTree
							onNodeCheck={departmentNodeCheckHandler}
							id={Project.UserManagement}
						/>
					</ShadowedContainer>
				</div>
				<div className={styles.table}>
					<PaginatedTable
						totalCountText={t("user.count", {
							framework: "React",
						})}
						totalCount={totalCount}
						pageSize={pageSize}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						data={users}
						columns={columns}
						onSearch={userSearchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						noRecordText={t("table.noUser", { framework: "React" })}
						hideWorkflowStatusDropdown
						showProjectDropdown
						onProjectOptonSelectionHandler={projectSelectionHandler}
						onActiveStatusOptionSelectionChange={statusSelectHandler}
						onWorkflowStatusOptionSelectionChange={() => {}}
						showRoleOption
						onRoleOptonSelectionHandler={roleSelectHandler}
					/>
				</div>
			</div>
		</PageContainer>
	);
};

export default UserAccountPage;
