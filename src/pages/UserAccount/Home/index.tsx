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
import { enGB, ar } from "date-fns/locale";

import { getUsersByDepartments } from "../../../api/users/get/getUsersByDepartments";
import { APIExportUser, APIUserName } from "../../../api/users/types";

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
import { APIExportData } from "../../../api";
import { exportUsers } from "../../../api/users/export/exportUsers";
import { toast } from "react-toastify";
import { format } from "date-fns";

const UserAccountPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const loggedUser = useStore((state) => state.loggedInUser);
	const [role, setRole] = useState<APIRole>();

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(50);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [users, setUsers] = useState<APIUserName[]>([]);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);

	const [selectedRole, setSelectedRole] = useState<Id>();
	const [selectedProject, setSelectedProject] = useState<Id>();
	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);
	const [orderBy, setOrderBy] = useState<string>("rankId");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	// const [departmentIdsTemp, setDepartmentIdsTemp] = useState<string[]>([]);
	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

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
						canExportPdf,
						canExportExcel,
					} = privilege;
					setPrivileges({
						readPrivilege,
						insertPrivilege,
						updatePrivilege,
						deletePrivilege,
						canExportPdf,
						canExportExcel,
					});
				}
			}
		};

		fetch();
	}, [role?.name, setPrivileges]);

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const logName = t("user.logName", { framework: "React" });
	const fullName = t("global.name", { framework: "React" });
	const nameEnglish = t("global.nameEnglish", { framework: "React" });

	const rank = t("rank.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	const phone = t("user.phone", { framework: "React" });
	const email = t("user.email", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });

	const columns: Column<UserColumns>[] = useMemo(
		() => [
			{
				id: "actions",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={""}
						// showView={true}
						detailPageLink={`${RoutePath.USER}/${value.id}`}
						editPageLink={`${RoutePath.USER}/${value.id}/edit`}
						showEdit={true}
					/>
				),
			},
			// {
			// 	Header: id,
			// 	id: "id",
			// 	accessor: (p) => p.id,
			// 	Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			// },
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
				Header: <div className={styles.tableHeaderCell}>{rank}</div>,
				id: "rankId",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{value.rank && (
							<>
								<div className={styles.arabic}>{value.rank.name}</div>
								<div className={styles.english}>{value.rank.nameEnglish}</div>
							</>
						)}
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
						code={value.activeStatus.id === 1 ? 1 : 9}
						text={
							language !== "ar"
								? value.activeStatus.nameArabic
								: value.activeStatus.nameEnglish
						}
					/>
				),
			},
		],
		[department, employeeNo, fullName, language, logName, rank, status]
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
				orderBy,
				toggleSort
			);

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
			currentPage,
			pageSize,
			keyword,
			selectedProject,
			selectedStatusCode,
			selectedRole,
			orderBy,
			toggleSort,
			navigate,
		]
	);

	const fetchByDepartment = useMemo(
		() => async () => {
			const { data } = await getUsersByDepartments(
				currentPage,
				pageSize,
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
			currentPage,
			pageSize,
			departmentIds,
			keyword,
			selectedRole,
			selectedProject,
			selectedStatusCode,
			orderBy,
		]
	);

	useEffect(() => {
		if (role && role?.name !== ROLE.USER) {
			if (departmentIds.length === 0) {
				fetch();
			} else {
				fetchByDepartment();
			}
		}
	}, [departmentIds.length, fetch, fetchByDepartment, role]);

	const userSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);

		if (keyword !== "") {
			setSelectedStatusCode("");
		} else {
			setSelectedStatusCode("1");
		}
		setCurrentPage(1);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);
		setOrderBy(columnId);
		setCurrentPage(1);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
		// fetchData(currentpage);
	};

	const departmentNodeCheckHandler = (ids: any) => {
		setDepartmentIds(ids);
		setCurrentPage(1);
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
		setCurrentPage(1);
	};

	const roleSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			setSelectedRole(option?.value!);
			setCurrentPage(1);
		},
		[]
	);

	const projectSelectionHandler = useMemo(
		() => (option: DropdownOption) => {
			setSelectedProject(option?.value!);
			setCurrentPage(1);
		},
		[]
	);

	const statusSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			if (option) {
				setSelectedStatusCode((prevState) => (prevState = option?.value!));
			} else {
				setSelectedStatusCode(1);
			}
			setCurrentPage(1);
		},
		[]
	);

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportUser,
		Record<string, string>
	> = {
		id: { value: "Id", text: id },
		employeeNo: { value: "EmployeeNo", text: employeeNo },
		nameEnglish: { value: "NameEnglish", text: nameEnglish },
		name: { value: "Name", text: fullName },
		logName: { value: "LogName", text: logName },
		rank: { value: "Rank", text: rank },
		department: { value: "Department", text: department },
		phone: { value: "Phone", text: phone },
		email: { value: "Email", text: email },
	};

	const exportDataHandler = async (data: APIExportData) => {
		setIsExportLoading(true);
		const dataValues: APIExportData = {
			...data,
			language: language === "ar" ? "en" : "ar",
			queryParams: {
				page: currentPage,
				postsPerPage: pageSize,
				keyword: keyword,
				projectId: selectedProject,
				statusCode: selectedStatusCode,
				orderBy: orderBy,
				isDescending: toggleSort,
			},
		};

		// saving to the file
		const us = t("user.names", { framework: "React" });
		const currentDate = format(new Date(), "ddMMyyyyhhmmss", {
			locale: language !== "ar" ? ar : enGB,
		});
		const fileName = `${us}_${currentDate}.${data.format}`;

		const { data: fData, error } = await exportUsers(dataValues, fileName);
		if (fData) {
			toast.success(t("message.downloaded", { framework: "React" }).toString());
		}
		if (error) {
			toast.error(
				t("message.unauthorizedExport", { framework: "React" }).toString()
			);
		}
		setIsExportLoading(false);
	};

	return (
		<PageContainer
			lockFor={[ROLE.USER]}
			displayContent={privileges?.readPrivilege!}
			title={t("page.userHome", { framework: "React" })}
			className={styles.userList}
			showAddButton={privileges?.insertPrivilege!}
			btnAddLabel={t("button.addNewUser", { framework: "React" })}
			btnAddUrlLink={RoutePath.USER_SEARCH}
			isExportSelectionLoading={isExportLoading}
			displayExportButton={
				privileges?.canExportExcel || privileges?.canExportPdf
			}
			exportDisplayNames={propertyDisplayNames}
			onExcelExport={exportDataHandler}
			onPdfExport={exportDataHandler}>
			<div className={styles.content}>
				<div className={styles.hierarchyContainer}>
					<div
						className={
							language === "ar" ? styles.hierarchyLTR : styles.hierarchy
						}>
						<DepartmentTree
							onNodeCheck={departmentNodeCheckHandler}
							id={Project.UserManagement}
							isExpanded
						/>
					</div>
				</div>
				<ShadowedContainer className={styles.table}>
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
						activeStatusPlaceHolder={t("user.status", { framework: "React" })}
						onActiveStatusOptionSelectionChange={statusSelectHandler}
						onWorkflowStatusOptionSelectionChange={() => {}}
						showRoleOption
						onRoleOptonSelectionHandler={roleSelectHandler}
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default UserAccountPage;
