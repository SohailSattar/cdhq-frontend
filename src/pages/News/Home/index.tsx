import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { deleteNews } from "../../../api/news/delete/deleteNews";
import { getNews } from "../../../api/news/get/getNews";
import { APINews } from "../../../api/news/types";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import {
	PaginatedTable,
	ActionButtons,
	PageContainer,
	PhotoThumbnailImage,
	ActiveStatus,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { NewsColumns } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { APIStatus } from "../../../api";
import { updateNewsStatus } from "../../../api/news/update/updateNewsStatus";
import { useStore } from "../../../utils/store";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { getFilteredNews } from "../../../api/news/get/getFilteredNews";

const NewsHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(50);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [news, setNews] = useState<APINews[]>([]);
	const [keyword, setKeyword] = useState("");

	// Dropdowns

	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();

	//Parameters
	const [toggleSort, setToggleSort] = useState(true);
	const [orderBy, setOrderBy] = useState<string>("Id");

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	const fetchData = useMemo(
		() => async (currentPage: number, keyword?: string) => {
			setIsLoadingData(true);
			const { data: privilege } = await getProjectPrivilege(Project.News);

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

				if (columnFilters.length > 0) {
					const { data } = await getFilteredNews(
						columnFilters,
						currentPage,
						pageSize,
						keyword,
						selectedStatusCode,
						orderBy,
						toggleSort
					);

					if (data) {
						setNews(data.news);
						setTotalCount(data.totalItems);
					} else {
						// navigate(RoutePath.ROOT);
					}
				} else {
					const { data } = await getNews(
						currentPage,
						pageSize,
						keyword,
						selectedStatusCode,
						orderBy,
						toggleSort
					);

					if (data) {
						setNews(data.news);
						setTotalCount(data.totalItems);
					} else {
					}
				}
			}

			setIsLoadingData(false);
		},
		[columnFilters, orderBy, pageSize, selectedStatusCode, toggleSort]
	);

	const fetchDepartment = useCallback(async () => {
		const { data } = await getDepartmentsByProject(Project.News);
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

	useEffect(() => {
		fetchData(currentPage, keyword);
	}, [fetchData, currentPage, pageSize, keyword]);

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
		fetchData(currentpage, keyword);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const editClickHandler = useMemo(
		() => (id: string) => {
			const editPath = RoutePath.NEWS_EDIT.replace(RoutePath.ID, id);
			navigate(editPath);
		},
		[navigate]
	);

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

			const { data, error } = await updateNewsStatus(params);

			if (data) {
				fetchData(currentPage, keyword);
				toast.success(
					t("message.newsActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
		},
		[currentPage, fetchData, keyword, t]
	);

	const deleteClickHandler = useMemo(
		() => async (id: Id) => {
			const { data, error } = await deleteNews(id);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				toast.error(
					t("message.newsDeactivated", { framework: "React" }).toString()
				);
				fetchData(currentPage, keyword);
			}
		},
		[currentPage, fetchData, keyword, t]
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

	const txtId = t("news.id", { framework: "React" });
	const title = t("news.title", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	//Actions
	const status = t("global.status", { framework: "React" });
	const actions = t("global.actions", { framework: "React" });

	const columnHelper = createColumnHelper<NewsColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.imageName, {
				id: "imageName",
				header: "",
				cell: (info) => <PhotoThumbnailImage src={info.getValue()!} />,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: txtId,
			}),
			columnHelper.accessor((row) => row.title, {
				id: "title",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => title,
			}),
			columnHelper.accessor((row) => row.department, {
				id: "departmentId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => department,
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
			columnHelper.accessor((row) => row, {
				id: "action",
				header: actions,
				cell: (info) => (
					<ActionButtons
						id={info.getValue().id}
						showActivate={info.getValue().activeStatus.id !== 1}
						onActivate={activateClickHandler}
						showEdit={privileges?.updatePrivilege}
						showDelete={
							privileges?.deletePrivilege &&
							info.getValue().activeStatus.id === 1
						}
						onDelete={deleteClickHandler}
						onEdit={() => editClickHandler(info.getValue().id.toString())}
					/>
				),
				enableColumnFilter: false,
			}),
		],
		[
			actions,
			activateClickHandler,
			activeStatusOptions,
			columnHelper,
			deleteClickHandler,
			department,
			departmentOptions,
			editClickHandler,
			language,
			privileges?.deletePrivilege,
			privileges?.updatePrivilege,
			status,
			t,
			title,
			txtId,
		]
	);

	const newsSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);

		setOrderBy(columnId);
		setCurrentPage(1);
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<PageContainer
			displayContent={privileges?.readPrivilege}
			title={t("page.newsHome", { framework: "React" })}
			showAddButton={privileges?.insertPrivilege}
			btnAddUrlLink={RoutePath.NEWS_NEW}
			btnAddLabel={t("button.add", { framework: "React" })}
			className={styles.news}>
			<PaginatedTable
				totalCountText={t("news.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={news}
				columns={columns}
				onSearch={newsSearchClickHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noNews", { framework: "React" })}
				// onActiveStatusOptionSelectionChange={statusSelectHandler}
				hideActiveStatusDropdown
				hideWorkflowStatusDropdown
				classNameTable={styles.table}
				onColumnFiltersChange={handleColumnFiltersChange}
				isLoading={loadingData}
			/>
		</PageContainer>
	);
};

export default NewsHomePage;
