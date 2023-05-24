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
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { NewsColumns } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";
import { toast } from "react-toastify";

const NewsHomePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [news, setNews] = useState<APINews[]>([]);
	const [keyword, setKeyword] = useState("");

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

				const { data } = await getNews(currentPage, pageSize, keyword);

				if (data) {
					setNews(data.news);
					setTotalCount(data.totalItems);
				} else {
					// navigate(RoutePath.ROOT);
				}
			}
		},
		[pageSize, keyword]
	);

	useEffect(() => {
		fetchData(currentPage, keyword);
	}, [fetchData, currentPage, pageSize, keyword]);

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentPage);
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

	const deleteClickHandler = useMemo(
		() => async (id: Id) => {
			const { data, error } = await deleteNews(id);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				fetchData(currentPage, keyword);
			}
		},
		[currentPage, fetchData]
	);

	const txtId = t("news.id", { framework: "React" });
	const title = t("news.title", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });

	const columns: Column<NewsColumns>[] = useMemo(
		() => [
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
				Header: actions,
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={value.id}
						detailPageLink={`${value.id}`}
						showView={privileges?.readPrivilege}
						showEdit={privileges?.updatePrivilege}
						showDelete={privileges?.deletePrivilege}
						onDelete={deleteClickHandler}
						onEdit={() => editClickHandler(value.id)}
					/>
				),
			},
		],
		[privileges, actions, editClickHandler, deleteClickHandler, title, txtId]
	);

	const newsSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	return (
		<PageContainer
			displayContent={privileges?.readPrivilege}
			title="News"
			showAddButton={privileges?.insertPrivilege}
			btnAddUrlLink={RoutePath.NEWS_NEW}
			btnAddLabel={t("button.add", { framework: "React" })}
			className={styles.news}>
			<PaginatedTable
				totalCountText={t("news.count", { framework: "React" })}
				totalCount={totalCount}
				pageSize={pageSize}
				data={news}
				columns={columns}
				onSearch={newsSearchClickHandler}
				onTableSort={() => {}}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noNews", { framework: "React" })}
				onActiveStatusOptionSelectionChange={() => {}}
			/>
		</PageContainer>
	);
};

export default NewsHomePage;
