import { FC, useEffect, useMemo, useState } from "react";
import { ActionButtons, Button, PaginatedTable } from "../..";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { NewsColumns } from "../../PaginatedTable/types";
import { APINews } from "../../../api/news/types";
import { DropdownOption } from "../../Dropdown";
import { getNews } from "../../../api/news/get/getNews";
import { Id } from "../../../utils";

interface Props {
	onViewClick: (id: Id) => void;
}

const TableList: FC<Props> = ({ onViewClick }) => {
	const [t] = useTranslation("common");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [news, setNews] = useState<APINews[]>([]);
	const [keyword, setKeyword] = useState("");

	const txtId = t("news.id", { framework: "React" });
	const title = t("news.title", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const view = t("button.view", { framework: "React" });

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
					<Button onClick={() => onViewClick(value.id)}>{view}</Button>
					// <ActionButtons
					// 	id={value.id}
					// 	detailPageLink={`${value.id}`}
					// 	showView={true}
					// 	showEdit={false}
					// 	showDelete={false}
					// />
				),
			},
		],
		[actions, title, txtId]
	);
	const fetchData = useMemo(
		() => async (currentPage: number, keyword?: string) => {
			const { data } = await getNews(currentPage, pageSize, keyword);

			if (data) {
				setNews(data.news);
				setTotalCount(data.totalItems);
			} else {
				// navigate(RoutePath.ROOT);
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

	const newsSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	return (
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
			onWorkflowStatusOptionSelectionChange={() => {}}
			hideWorkflowStatusDropdown
		/>
	);
};

export default TableList;
