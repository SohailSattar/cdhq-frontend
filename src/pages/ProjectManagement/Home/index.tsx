import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
	ActiveStatus,
	PageContainer,
	PaginatedTable,
	RedirectButton,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";

import { APIProject } from "../../../api/projects/types";
import { getProjects } from "../../../api/projects/get/getProjects";

import { Id, ROLE } from "../../../utils";
import { useStore } from "../../../utils/store";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { ProjectColumns } from "../../../components/PaginatedTable/types";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { getProjectGroups } from "../../../api/projectGroup/get/getProjectGroups";
import { getFilteredProjects } from "../../../api/projects/get/getFilteredProjects";

const ProjectManagementPage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const role = useStore((state) => state.loggedInUser.role);
	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [projects, setProjects] = useState<APIProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [orderBy, setOrderBy] = useState<string>("Id");
	const [toggleSort, setToggleSort] = useState(false);

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();

	const [projectGroupArabicOptions, setProjectGroupArabicOptions] = useState<
		DropdownOption[]
	>([]);
	const [projectGroupEnglishOptions, setProjectGroupEnglishOptions] = useState<
		DropdownOption[]
	>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

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

	const fetchProjectGroup = useCallback(async () => {
		const { data } = await getProjectGroups();
		if (data) {
			setProjectGroupArabicOptions(
				data?.map((x) => {
					return {
						label: x.nameArabic,
						value: x.id,
					};
				})
			);

			setProjectGroupEnglishOptions(
				data?.map((x) => {
					return {
						label: x.nameEnglish,
						value: x.id,
					};
				})
			);
		}
	}, []);

	useEffect(() => {
		fetchProjectGroup();
	}, [fetchProjectGroup]);

	const id = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const projectNameEng = t("project.nameEnglish", { framework: "React" });
	const projectGroup = t("project.group", { framework: "React" });
	const projectGroupEnglish = t("project.groupEnglish", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });

	const columnHelper = createColumnHelper<ProjectColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor("id", {
				header: id,
				cell: (info) => <div className={styles.cell}>{info.getValue()}</div>,
			}),
			columnHelper.accessor((row) => row.name, {
				id: "name",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{projectName}</span>,
			}),
			columnHelper.accessor((row) => row.nameEnglish, {
				id: "nameEnglish",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{projectNameEng}</span>,
			}),
			columnHelper.accessor((row) => row.group.nameArabic, {
				id: "projectGroupId",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{projectGroup}</span>,
				meta: {
					filterVariant: "select",
					options: projectGroupArabicOptions,
				},
			}),
			columnHelper.accessor((row) => row.group.nameEnglish, {
				id: "projectGroupNameEnglish",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => <span>{projectGroupEnglish}</span>,
				meta: {
					filterVariant: "select",
					options: projectGroupEnglishOptions,
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
			columnHelper.accessor((row) => row.id, {
				id: "action",
				cell: (info) => (
					<div className={styles.action}>
						<div className={styles.btnDiv}>
							<RedirectButton
								label={detail}
								redirectTo={`${RoutePath.PROJECT_DETAIL.replace(
									RoutePath.ID,
									info.getValue().toString()
								)}`}
								style={{ height: "20px", fontSize: "12px" }}
							/>
						</div>
					</div>
				),
				header: "",
				enableColumnFilter: false,
			}),
		],
		[
			activeStatusOptions,
			columnHelper,
			detail,
			id,
			language,
			projectGroup,
			projectGroupArabicOptions,
			projectGroupEnglish,
			projectGroupEnglishOptions,
			projectName,
			projectNameEng,
			status,
			t,
		]
	);

	const fetchProjects = useMemo(
		() => async () => {
			setIsLoadingData(true);
			const { data, error } = await getFilteredProjects(
				columnFilters,
				currentPage,
				pageSize,
				keyword,
				selectedStatusCode,
				orderBy,
				toggleSort
			);
			if (error) {
				if (error?.response!.status! === 403) {
					setCanView(false);
				}
			}

			if (data) {
				setProjects(data?.projects);
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
			fetchProjects();
			setCanView(true);
		}
	}, [fetchProjects, currentPage, pageSize, role]);

	const projectSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const pageChangeHandler = (currentPage: number) => {
		// fetchProjects();
		setCurrentPage(currentPage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;
		setPageSize(size);
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
		setCurrentPage(1);
		// fetchProjects(currentPage, orderByParam);
	};

	const statusSelectHandler = (option: DropdownOption) => {
		if (option) {
			setSelectedStatusCode(option?.value!);
		} else {
			setSelectedStatusCode("");
		}
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			title={t("page.projectHome", { framework: "React" })}
			showAddButton={role === ROLE.SUPERADMIN}
			btnAddLabel={t("button.addNewProject", { framework: "React" })}
			btnAddUrlLink={RoutePath.PROJECT_NEW}
			className={styles.projectsList}>
			<PaginatedTable
				totalCountText={t("project.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={projects}
				columns={columns}
				onSearch={projectSearchClickHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				hideWorkflowStatusDropdown
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noProject", { framework: "React" })}
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				onWorkflowStatusOptionSelectionChange={() => {}}
				onColumnFiltersChange={handleColumnFiltersChange}
				isLoading={loadingData}
			/>
		</PageContainer>
	);
};

export default ProjectManagementPage;
