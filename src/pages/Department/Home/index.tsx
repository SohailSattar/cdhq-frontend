import { useTranslation } from "react-i18next";
import {
	ActionButtons,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { APIDepartmentItem } from "../../../api/departments/types";
import { Id, ROLE } from "../../../utils";
import { DepartmentColumns } from "../../../components/PaginatedTable/types";
import { ColumnFiltersState, createColumnHelper } from "@tanstack/react-table";
import * as RoutePath from "../../../RouteConfig";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getEmirates } from "../../../api/emirates/get/getEmirates";
import { getDepartmentLevels } from "../../../api/departmentLevel/get/getDepartmentLevels";
import { getFilteredDepartments } from "../../../api/departments/get/getFilteredDepartments";

const DepartmentHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const role = useStore((state) => state.loggedInUser.role);
	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [levelOptions, setLevelOptions] = useState<DropdownOption[]>([]);
	const [emirateOptions, setEmirateOptions] = useState<DropdownOption[]>([]);

	const [departments, setDepartments] = useState<APIDepartmentItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [orderBy, setOrderBy] = useState<string>("Id");

	const [toggleSort, setToggleSort] = useState(false);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	const id = t("department.id", { framework: "React" });
	const departmentName = t("department.name", { framework: "React" });
	const level = t("department.level", { framework: "React" });
	const parentDept = t("department.parent", {
		framework: "React",
	});
	const emirate = t("emirate.name", {
		framework: "React",
	});

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentLevels();

			if (data) {
				setLevelOptions(
					data.map((x) => ({
						label: `${x.id} - ${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getEmirates();

			if (data) {
				setEmirateOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
			}
		};

		fetch();
	}, [language]);

	const columnHelper = createColumnHelper<DepartmentColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: id,
			}),
			columnHelper.accessor((row) => row, {
				id: "fullName",
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{info.getValue()!.fullName}</div>
						<div className={styles.english}>
							{info.getValue()!.fullNameEnglish}
						</div>
					</div>
				),
				header: () => <span>{departmentName}</span>,
			}),
			columnHelper.accessor((row) => row.level, {
				id: "levelId",
				cell: (info) =>
					info.getValue()! ? (
						<div className={styles.name}>
							<div className={styles.arabic}>{info.getValue()!.name!}</div>
							<div className={styles.english}>
								{info.getValue()!.nameEnglish}
							</div>
						</div>
					) : (
						<div className={styles.name}>-</div>
					),
				header: () => <span>{level}</span>,
				meta: {
					filterVariant: "select",
					options: levelOptions,
				},
			}),
			columnHelper.accessor((row) => row.emirate, {
				id: "emirateId",
				cell: (info) =>
					info.getValue()! ? (
						<div className={styles.name}>
							<div className={styles.arabic}>{info.getValue()!.name!}</div>
							<div className={styles.english}>
								{info.getValue()!.nameEnglish}
							</div>
						</div>
					) : (
						<div className={styles.name}>-</div>
					),
				header: () => <span>{emirate}</span>,
				meta: {
					filterVariant: "select",
					options: emirateOptions,
				},
			}),
			columnHelper.accessor((row) => row.id, {
				id: "actions",
				cell: (info) => (
					<ActionButtons
						id={""}
						// showView={true}
						detailPageLink={`${RoutePath.DEPARTMENT}/${info
							.getValue()
							.toString()}`}
						editPageLink={`${RoutePath.DEPARTMENT}/${info
							.getValue()
							.toString()}/edit`}
						showEdit={true}
					/>
				),
				header: "",
				enableColumnFilter: false,
			}),
		],
		[
			columnHelper,
			departmentName,
			emirate,
			emirateOptions,
			id,
			level,
			levelOptions,
		]
	);

	const fetchDepartments = useMemo(
		() => async () => {
			setIsLoadingData(true);
			const { data, error } = await getFilteredDepartments(columnFilters, {
				page: currentPage,
				postsPerPage: pageSize,
				keyword,
				statusCode: selectedStatusCode,
				orderBy,
				isDescending: toggleSort,
			});
			if (error) {
				if (error?.response!.status! === 403) {
					setCanView(false);
				}
			}

			if (data) {
				setDepartments(data?.departments);
				setTotalCount(data?.totalItems);
				setPageSize(data?.pageSize);
			}
			setIsLoadingData(false);
		},
		[
			columnFilters,
			currentPage,
			pageSize,
			keyword,
			selectedStatusCode,
			orderBy,
			toggleSort,
		]
	);

	useEffect(() => {
		if (role === ROLE.USER || role === "") {
			setCanView(false);
			return;
		} else {
			fetchDepartments();
			setCanView(true);
		}
	}, [fetchDepartments, currentPage, pageSize, role]);

	const departmentSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const pageChangeHandler = (currentPage: number) => {
		setCurrentPage(currentPage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;
		setPageSize(size);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);

		setOrderBy(columnId);
		setCurrentPage(1);
	};

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

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			title={t("page.departmentHome", { framework: "React" })}
			showAddButton={role === ROLE.SUPERADMIN}
			btnAddLabel={t("button.addNewDepartment", { framework: "React" })}
			btnAddUrlLink={RoutePath.DEPARTMENT_NEW}
			className={styles.departmentsList}>
			<div className={styles.content}>
				<ShadowedContainer className={styles.table}>
					<PaginatedTable
						totalCountText={"Total Count"}
						totalCount={totalCount}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageSize={pageSize}
						data={departments}
						columns={columns}
						noRecordText={""}
						onSearch={departmentSearchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						onActiveStatusOptionSelectionChange={statusSelectHandler}
						onColumnFiltersChange={handleColumnFiltersChange}
						isLoading={loadingData}
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default DepartmentHomePage;
