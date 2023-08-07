import { useEffect, useState } from "react";
import { getMenuListPaginated } from "../../../api/menu/get/getMenuListPaginated";
import PaginatedTable from "../../PaginatedTable";
import { DropdownOption } from "../../Dropdown";
import { MenuItemColumns } from "../../PaginatedTable/types";
import { Column } from "react-table";
import { useTranslation } from "react-i18next";
import { ActiveStatus, RedirectButton } from "../..";
import { APIMenuItemDetail } from "../../../api/menu/types";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";

const MenuTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APIMenuItemDetail[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMenuListPaginated(
				currentPage,
				pageSize,
				keyword,
				"",
				orderBy
			);
			if (data) {
				console.log(data);
				setItems(data.menuItems);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [currentPage, keyword, orderBy, pageSize]);

	const id = t("menu.id", { framework: "React" });
	const menuName = t("menu.name", { framework: "React" });
	const menuNameEng = t("menu.nameEnglish", { framework: "React" });
	const parent = t("menu.parent", { framework: "React" });
	const parentEnglish = t("menu.parentEnglish", { framework: "React" });
	const linkPath = t("menu.pathLink", { framework: "React" });
	const orderNo = t("menu.orderNo", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const columns: Column<MenuItemColumns>[] = [
		{
			Header: id,
			id: "id",
			accessor: (p) => p.id,
		},
		{
			Header: menuName,
			id: "name",
			accessor: (p) => (language !== "ar" ? p.name : p.nameEnglish),
		},
		{
			Header: parent,
			id: "parent",
			accessor: (p) =>
				language !== "ar" ? p.parent?.name : p.parent?.nameEnglish,
		},
		{
			Header: linkPath,
			id: "linkPath",
			accessor: (p) => p.linkPath,
		},
		{
			Header: orderNo,
			id: "orderNo",
			accessor: (p) => p.orderNo,
		},
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
							redirectTo={`${RoutePath.SETTINGS_MENU_EDIT.replace(
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
		<>
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
			/>
		</>
	);
};

export default MenuTable;
