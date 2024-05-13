import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../../api/users/get/getUsers";
import {
	ActionButtons,
	ActiveStatus,
	DepartmentTree,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";

import { useStore } from "../../../utils/store";
import { enGB, ar } from "date-fns/locale";

import { getUsersByDepartments } from "../../../api/users/get/getUsersByDepartments";
import { APIExportUser, APIUserName } from "../../../api/users/types";

import * as RoutePath from "../../../RouteConfig";

import { Id, ROLE } from "../../../utils";

import { ColumnFiltersState, createColumnHelper } from "@tanstack/react-table";
import { UserColumns } from "../../../components/PaginatedTable/types";

import styles from "./styles.module.scss";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { APIRole } from "../../../api/roles/types";
import { getMyRole } from "../../../api/users/get/getMyRole";
import { APIExportData } from "../../../api";
import { exportUsers } from "../../../api/users/export/exportUsers";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { getFilteredUsers } from "../../../api/users/get/getFilteredUsers";
import { getRanks } from "../../../api/ranks/get/getRanks";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";

const UserAccountPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);
	const [role, setRole] = useState<APIRole>();

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(50);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [users, setUsers] = useState<APIUserName[]>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	const [rankOptions, setRankOptions] = useState<DropdownOption[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);

	const [selectedRole, setSelectedRole] = useState<Id>();
	const [selectedProject, setSelectedProject] = useState<Id>();
	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();
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

	const fetchRanks = useCallback(async () => {
		const { data } = await getRanks();
		if (data) {
			setRankOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchRanks();
	}, [fetchRanks]);

	const fetchDepartment = useCallback(async () => {
		const { data } = await getDepartmentsByProject(Project.UserManagement);
		if (data) {
			setDepartmentOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchDepartment();
	}, [fetchDepartment]);

	const activeStatusOptions: DropdownOption[] = useMemo(
		() => [
			{
				label: t("status.active", {
					framework: "React",
				}),
				value: 1,
			},
			{
				label: t("status.deactive", {
					framework: "React",
				}),
				value: 9,
			},
		],
		[t]
	);

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const logName = t("user.logName", { framework: "React" });
	const nameArabic = t("global.name", { framework: "React" });
	const fullName = t("user.fullName", { framework: "React" });
	const nameEnglish = t("global.nameEnglish", { framework: "React" });

	const rank = t("rank.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	const phone = t("user.phone", { framework: "React" });
	const email = t("user.email", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });

	const columnHelper = createColumnHelper<UserColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				enableColumnFilter: false,
				header: "",
				cell: (info) => (
					<ActionButtons
						id={""}
						// showView={true}
						detailPageLink={`${RoutePath.USER}/${info.getValue()}`}
						editPageLink={`${RoutePath.USER}/${info.getValue()}/edit`}
						showEdit={true}
					/>
				),
			}),
			// columnHelper.accessor("id", {
			// 	header: id,
			// 	cell: (info) => <div className={styles.cell}>{info.getValue()}</div>,
			// }),
			columnHelper.accessor((row) => row.employeeNo, {
				id: "employeeNo",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{employeeNo}</span>,
			}),
			columnHelper.accessor((row) => row.logName, {
				id: "logName",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{logName}</span>,
			}),
			columnHelper.accessor((row) => row, {
				id: "fullName",
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{info.getValue().name}</div>
						<div className={styles.english}>{info.getValue().nameEnglish}</div>
					</div>
				),
				header: () => <span>{fullName}</span>,
			}),
			columnHelper.accessor((row) => row.rank, {
				id: "rankId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue() && (
							<>
								<div className={styles.arabic}>{info.getValue().name}</div>
								<div className={styles.english}>
									{info.getValue().nameEnglish}
								</div>
							</>
						)}
					</div>
				),
				header: () => <div className={styles.tableHeaderCell}>{rank}</div>,
				meta: {
					filterVariant: "select",
					options: rankOptions,
				},
			}),
			columnHelper.accessor((row) => row.department, {
				id: "departmentId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue() && (
							<>
								<div className={styles.arabic}>{info.getValue().name}</div>
								<div className={styles.english}>
									{info.getValue().nameEnglish}
								</div>
							</>
						)}
					</div>
				),
				header: () => (
					<div className={styles.tableHeaderCell}>{department}</div>
				),
				meta: {
					filterVariant: "select",
					options: departmentOptions,
				},
			}),
			columnHelper.accessor((row) => row.activeStatus, {
				id: "activeStatusId",
				cell: (info) => (
					<div className={styles.name}>
						<ActiveStatus
							code={info.getValue().id === 1 ? 1 : 9}
							text={
								language !== "ar"
									? info.getValue().nameArabic
									: info.getValue().nameEnglish
							}
						/>
					</div>
				),
				header: () => <div className={styles.tableHeaderCell}>{status}</div>,
				meta: {
					filterVariant: "select",
					options: activeStatusOptions,
					initialValue: {
						label: t("status.active", {
							framework: "React",
						}),
						value: 1,
					},
				},
			}),
		],
		[
			activeStatusOptions,
			columnHelper,
			department,
			departmentOptions,
			employeeNo,
			fullName,
			language,
			logName,
			rank,
			rankOptions,
			status,
			t,
		]
	);

	// New maybe
	const fetch = useMemo(
		() => async () => {
			const { data, error } = await getFilteredUsers(
				columnFilters,
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
			columnFilters,
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

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportUser,
		Record<string, string>
	> = {
		id: { value: "Id", text: id },
		employeeNo: { value: "EmployeeNo", text: employeeNo },
		rank: { value: "Rank", text: rank },
		nameEnglish: { value: "NameEnglish", text: nameEnglish },
		name: { value: "Name", text: nameArabic },
		logName: { value: "LogName", text: logName },
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
				type: selectedRole?.toString()!,
				isDescending: toggleSort,
			},
			departmentIds: departmentIds,
			filters: columnFilters,
		};

		console.log(dataValues);

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
			displayExportButton={true}
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
						hideActiveStatusDropdown
						onWorkflowStatusOptionSelectionChange={() => {}}
						showRoleOption
						onRoleOptonSelectionHandler={roleSelectHandler}
						onColumnFiltersChange={handleColumnFiltersChange}
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default UserAccountPage;
