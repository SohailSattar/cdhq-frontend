import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { getNews } from "../../../api/news/get/getNews";
import { APINews } from "../../../api/news/types";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import {
	Button,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
	ActionButtons,
	NotAuthorized,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { NewsColumns } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";
import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";

const NewsHomePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [news, setNews] = useState<APINews[]>([]);

	const fetchData = useMemo(
		() => async (currentPage: number) => {
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

				const { data } = await getNews(currentPage, pageSize);

				if (data) {
					setNews(data.news);
					setTotalCount(data.totalItems);
				} else {
					// navigate(RoutePath.ROOT);
				}
			}
		},
		[currentPage, pageSize]
	);

	useEffect(() => {
		fetchData(currentPage);
	}, [fetchData, currentPage, pageSize]);

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentPage);
		fetchData(currentpage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const editClickHandler = (id: string) => {
		navigate(`${RoutePath.NEWS}/${id}/edit`);
	};

	const txtId = t("news.id", { framework: "React" });
	const title = t("news.title", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

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
						onEdit={() => editClickHandler(value.id)}
					/>
				),
			},
		],
		[privileges]
	);

	return (
		<div className={styles.news}>
			{privileges?.insertPrivilege && (
				<ShadowedContainer className={styles.section}>
					<RedirectButton
						label={t("button.add", { framework: "React" })}
						redirectTo={`${RoutePath.NEWS}/new`}
					/>
				</ShadowedContainer>
			)}

			<div>
				<PaginatedTable
					totalCount={totalCount}
					pageSize={pageSize}
					data={news}
					columns={columns}
					onSearch={() => {}}
					onTableSort={() => {}}
					onPageChange={pageChangeHandler}
					onPageViewSelectionChange={pageViewSelectionHandler}
				/>
			</div>
		</div>
	);
};

export default NewsHomePage;
