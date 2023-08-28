import { useTranslation } from "react-i18next";
import { PaginatedTable, RedirectButton, StatusIcon } from "../..";
import { useStore } from "../../../utils/store";
import { useEffect, useState } from "react";
import { APILinkTypeDetail } from "../../../api/linkTypes/types";
import { getLinkTypesPaginated } from "../../../api/linkTypes/get/getLinkTypesPaginated";
import { DropdownOption } from "../../Dropdown";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { LinkTypeColumns } from "../../PaginatedTable/types";
import { Column } from "react-table";

const LinkTypesTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APILinkTypeDetail[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLinkTypesPaginated(
				currentPage,
				pageSize,
				keyword,
				"",
				orderBy
			);
			if (data) {
				setItems(data.linkTypes);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [currentPage, keyword, orderBy, pageSize]);

	const id = t("linkType.id", { framework: "React" });
	const linkName = t("linkType.name", { framework: "React" });
	const linkNameEng = t("linkType.nameEnglish", { framework: "React" });
	const isFile = t("linkType.isFile", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const columns: Column<LinkTypeColumns>[] = [
		{
			Header: id,
			id: "id",
			accessor: (p) => p.id,
		},
		{
			Header: linkName,
			id: "name",
			accessor: (p) => p.name,
		},
		{
			Header: linkNameEng,
			id: "nameEnglish",
			accessor: (p) => p.nameEnglish,
		},
		{
			Header: isFile,
			id: "isFile",
			accessor: (p) => <StatusIcon status={p.isFile} />,
		},
		// {
		// 	Header: linkType,
		// 	accessor: (p) =>
		// 		language !== "ar" ? p.linkType?.name : p.linkType?.nameEnglish,
		// },
		// {
		// 	Header: status,
		// 	id: "activeStatus",
		// 	accessor: (p) => p,
		// 	Cell: ({ value }: any) => (
		// 		<ActiveStatus
		// 			code={value.activeStatus?.id!}
		// 			text={
		// 				language !== "ar"
		// 					? value.activeStatus.nameArabic
		// 					: value.activeStatus.nameEnglish
		// 			}
		// 		/>
		// 	),
		// },
		{
			Header: actions,
			accessor: (p) => p.id,
			Cell: ({ value }: any) => (
				<div className={styles.action}>
					<div className={styles.btnDiv}>
						<RedirectButton
							label={edit}
							redirectTo={`${RoutePath.SETTINGS_LINK_TYPES_EDIT.replace(
								RoutePath.ID,
								value
							)}`}
							style={{ height: "20px", fontSize: "12px" }}
						/>
					</div>
				</div>
			),
		},
	];

	const searchClickHandler = (keyword: string) => {
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
		setOrderBy(orderByParam);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
	};

	return (
		<PaginatedTable
			totalCountText={t("menu.count", { framework: "React" })}
			totalCount={totalCount}
			currentPage={currentPage}
			setCurrentPage={setCurrentPage}
			pageSize={pageSize}
			data={items}
			columns={columns}
			noRecordText={""}
			onSearch={searchClickHandler}
			onTableSort={tableSortHandler}
			onPageChange={pageChangeHandler}
			onPageViewSelectionChange={pageViewSelectionHandler}
			hideWorkflowStatusDropdown={true}
			hideActiveStatusDropdown
		/>
	);
};

export default LinkTypesTable;
