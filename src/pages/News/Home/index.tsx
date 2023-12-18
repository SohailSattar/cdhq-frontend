import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
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

const NewsHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [news, setNews] = useState<APINews[]>([]);
	const [keyword, setKeyword] = useState("");

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);
	const [orderBy, setOrderBy] = useState<string>("Id");

	const fetchData = useMemo(
		() => async (currentPage: number, keyword?: string) => {
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
					// navigate(RoutePath.ROOT);
				}
			}
		},
		[orderBy, pageSize, selectedStatusCode, toggleSort]
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

	// const deleteClickHandler = useCallback(
	// 	() => async (id: Id) => {
	// 		const { data } = await deleteNews(id);

	// 		console.log(data);

	// 		if (data) {
	// 			fetchData(currentPage);
	// 		}
	// 	},
	// 	[currentPage, fetchData]
	// );

	// const deleteClickHandler = async (id: Id) => {
	// 	const { data } = await deleteNews(id);

	// 	console.log(data);

	// 	if (data) {
	// 		fetchData(currentPage);
	// 	}
	// };

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
	const actions = t("global.actions", { framework: "React" });

	const columns: Column<NewsColumns>[] = useMemo(
		() => [
			{
				id: "img",
				accessor: (p) => p.imageName,
				Cell: ({ value }: any) => <PhotoThumbnailImage src={value!} />,
			},
			{
				Header: txtId,
				id: "id",
				accessor: (p) => p.id,
			},
			{
				Header: title,
				id: "title",
				accessor: (p) => p.title,
			},
			{
				Header: department,
				id: "department",
				accessor: (p) => p.department,
				Cell: ({ value }: any) => (
					<div>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: actions,
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={value.id}
						showActivate={value.activeStatus.id !== 1}
						onActivate={activateClickHandler}
						// detailPageLink={`${RoutePath.NEWS}/${value.id}`}
						// showView={privileges?.readPrivilege}
						showEdit={privileges?.updatePrivilege}
						showDelete={
							privileges?.deletePrivilege && value.activeStatus.id === 1
						}
						onDelete={deleteClickHandler}
						onEdit={() => editClickHandler(value.id)}
					/>
				),
			},
		],
		[
			txtId,
			title,
			department,
			actions,
			activateClickHandler,
			privileges?.updatePrivilege,
			privileges?.deletePrivilege,
			deleteClickHandler,
			editClickHandler,
		]
	);

	const newsSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);

		setOrderBy(columnId);
		console.log(columnId);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
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
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				hideWorkflowStatusDropdown
				classNameTable={styles.table}
			/>
		</PageContainer>
	);
};

export default NewsHomePage;
