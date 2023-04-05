import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../../api/users/get/getUsers";
import {
	Button,
	DepartmentTree,
	NotAuthorized,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";
import { getUsersByKeyword } from "../../../api/users/get/getUsersByKeyword";
import { DropdownOption } from "../../../components/Dropdown";

import { useStore } from "../../../utils/store";

import { getUsersByDepartments } from "../../../api/users/get/getUsersByDepartments";
import { APIUserName } from "../../../api/users/types";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";

import { Column } from "react-table";
import { UserColumns } from "../../../components/PaginatedTable/types";

import styles from "./styles.module.scss";

const UserAccountPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const { role } = useStore((state) => state.loggedInUser);

	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [users, setUsers] = useState<APIUserName[]>([]);

	const [toggleSort, setToggleSort] = useState(false);

	const [departmentIdsTemp, setDepartmentIdsTemp] = useState<string[]>([]);
	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const logName = t("user.logName", { framework: "React" });
	const fullName = t("user.fullName", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });
	// const activate = t("button.activate", { framework: "React" });
	// const deactivate = t("button.deactivate", { framework: "React" });

	const columns: Column<UserColumns>[] = useMemo(
		() => [
			{
				Header: id,
				id: "id",
				accessor: (p) => p.id,
			},
			{
				Header: employeeNo,
				id: "employeeNo",
				accessor: (p) => p.employeeNo,
			},
			{
				Header: logName,
				id: "logName",
				accessor: (p) => p.logName,
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
				Header: actions,
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.action}>
						{role === ROLE.SUPERADMIN && (
							<div
								className={language !== "ar" ? styles.btnDiv : styles.btnDivLTR}
							>
								<RedirectButton
									label={edit}
									redirectTo={`${RoutePath.USER}/${value.id}/edit`}
								/>
							</div>
						)}
						<div
							className={language !== "ar" ? styles.btnDiv : styles.btnDivLTR}
						>
							<RedirectButton
								label={detail}
								redirectTo={`${RoutePath.USER}/${value.id}`}
							/>
						</div>
						{/* {role === ROLE.SUPERADMIN && (
							<div
								className={
									language !== 'ar' ? styles.btnDiv : styles.btnDivLTR
								}>
								{value.activeStatus.id !== 7 ? (
									<Button>
										{t('button.activate', { framework: 'React' })}
									</Button>
								) : (
									<Button>
										{t('button.deactivate', { framework: 'React' })}
									</Button>
								)}
							</div>
						)} */}
					</div>
				),
			},
		],
		[actions, detail, edit, employeeNo, fullName, id, language, logName, role]
	);

	const fetchData = useMemo(
		() => async (currentPage: number, parameter?: string, filterBy?: string) => {
			if (departmentIds.length > 0) {
				const { data } = await getUsersByDepartments(
					currentPage,
					pageSize,
					departmentIds,
					keyword
				);

				if (data) {
					// setCanView(true)
					setUsers(data?.users);
					setTotalCount(data?.totalItems);
				}
			} else {
				if (keyword === "") {
					// Get all the users if no keyword is mentioned
					const { data, error } = await getUsers(
						currentPage,
						pageSize,
						parameter
					);

					if (error?.response!.status! === 401) {
						navigate(RoutePath.LOGIN);
					} else if (error?.response!.status! === 403) {
						setCanView(false);
						return;
					}

					if (data) {
						setUsers(data.users);
						setTotalCount(data.totalItems);
					}

					// });
				} else {
					const { data } = await getUsersByKeyword(
						keyword,
						currentPage,
						pageSize,
						parameter
					);

					if (data) {
						setUsers(data?.users);
						setTotalCount(data?.totalItems);
					}
				}
			}
		},
		[departmentIds, keyword, navigate, pageSize]
	);

	useEffect(() => {
		if (role === ROLE.USER) {
			setCanView(false);
			return;
		} else {
			setCanView(true);
		}

		fetchData(1);
	}, [fetchData, role]);

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
		fetchData(currentPage, orderByParam);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentPage);
		fetchData(currentpage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const departmentNodeCheckHandler = (ids: any) => {
		setDepartmentIdsTemp(ids);
	};

	const fetchUsersByDepartment = useMemo(
		() => async () => {
			const { data } = await getUsersByDepartments(1, 10, departmentIds);

			if (data) {
				setUsers(data?.users);
				setTotalCount(data?.totalItems);
			}
		},
		[departmentIds]
	);

	const filterByDepartmentClickHandler = () => {
		setDepartmentIds(departmentIdsTemp);
		if (departmentIdsTemp.length > 0) {
			fetchUsersByDepartment();
		} else {
			fetchData(1);
		}
	};

	return (
		<>
			{!canView ? (
				<NotAuthorized />
			) : (
				<div className={styles.userList}>
					{role === ROLE.SUPERADMIN && (
						<ShadowedContainer className={styles.section}>
							<RedirectButton
								label={t("button.addNewUser", { framework: "React" })}
								redirectTo={RoutePath.USER_SEARCH}
							/>
						</ShadowedContainer>
					)}
					<div className={styles.content}>
						<div>
							<ShadowedContainer
								className={language === "ar" ? styles.filterLTR : styles.filter}
							>
								<Button onClick={filterByDepartmentClickHandler}>
									{t("filter.byDepartment", { framework: "React" })}
								</Button>
							</ShadowedContainer>
							<ShadowedContainer
								className={
									language === "ar" ? styles.hierarchyLTR : styles.hierarchy
								}
							>
								<DepartmentTree onNodeCheck={departmentNodeCheckHandler} />
							</ShadowedContainer>
						</div>
						<div className={styles.table}>
							<PaginatedTable
								totalCountText={t("pagination.usersPerPage", {
									framework: "React",
								})}
								totalCount={totalCount}
								pageSize={pageSize}
								data={users}
								columns={columns}
								onSearch={userSearchClickHandler}
								onTableSort={tableSortHandler}
								onPageChange={pageChangeHandler}
								onPageViewSelectionChange={pageViewSelectionHandler}
								noRecordText={t("table.noUser", { framework: "React" })}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default UserAccountPage;
