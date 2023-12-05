import { useCallback, useEffect, useState } from "react";
import { getMenuListPaginated } from "../../../api/menu/get/getMenuListPaginated";
import PaginatedTable from "../../PaginatedTable";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";
import { MenuItemColumns } from "../../PaginatedTable/types";
import { Column } from "react-table";
import { useTranslation } from "react-i18next";
import { ActiveStatus, RedirectButton, StatusIcon } from "../..";
import { APIMenuItemDetail } from "../../../api/menu/types";

import * as RoutePath from "../../../RouteConfig";

import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";
import { getAllMenuTypes } from "../../../api/menuTypes/get/getAllMenuTypes";
import { APIType } from "../../../api/menuTypes/types";
import { getLinkTypes } from "../../../api/linkTypes/get/getLinkTypes";
import { getParentMenuItems } from "../../../api/menu/get/getParentMenuItems";
import { Id } from "react-toastify";

const MenuTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [parentOptions, setParentOptions] = useState<DropdownOption[]>([]);
	const [menuTypeOptions, setMenuTypeOptions] = useState<DropdownOption[]>([]);
	const [linkTypeOptions, setLinkTypeOptions] = useState<DropdownOption[]>([]);

	const [items, setItems] = useState<APIMenuItemDetail[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [parentId, setParentId] = useState<Id>("");
	const [menuTypeId, setMenuTypeId] = useState<Id>("");
	const [linkTypeId, setLinkTypeId] = useState<Id>("");

	const [statusCode, setStatusCode] = useState<Id>("");

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	const fetchParents = useCallback(async () => {
		const { data } = await getParentMenuItems();
		if (data) {
			setParentOptions(
				data?.map((x) => {
					return {
						label: `${x.id} - ${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchParents();
	}, [fetchParents]);

	const fetchMenuTypes = useCallback(async () => {
		const { data } = await getAllMenuTypes();
		if (data) {
			setMenuTypeOptions(
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
		fetchMenuTypes();
	}, [fetchMenuTypes]);

	const fetchLinkTypes = useCallback(async () => {
		const { data } = await getLinkTypes();
		if (data) {
			setLinkTypeOptions(
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
		fetchLinkTypes();
	}, [fetchLinkTypes]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMenuListPaginated(
				currentPage,
				pageSize,
				keyword,
				parentId,
				menuTypeId,
				linkTypeId,
				statusCode,
				orderBy
			);

			if (data) {
				setItems(data.menuItems);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [
		currentPage,
		keyword,
		linkTypeId,
		menuTypeId,
		orderBy,
		pageSize,
		parentId,
		statusCode,
	]);

	const id = t("menu.id", { framework: "React" });
	const menuName = t("menu.name", { framework: "React" });
	const parent = t("menu.parent", { framework: "React" });
	const linkPath = t("menu.pathLink", { framework: "React" });
	const orderNo = t("menu.orderNo", { framework: "React" });
	const linkType = t("menu.linkType", { framework: "React" });
	const isExternalPath = t("menu.isExternal", { framework: "React" });

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
			Header: "menuType",
			id: "menuType",
			accessor: (p) =>
				language !== "ar" ? p.menuType?.name : p.menuType?.nameEnglish,
		},
		{
			Header: menuName,
			id: "name",
			accessor: (p) => (language !== "ar" ? p.name : p.nameEnglish),
		},
		{
			Header: parent,
			id: "parentId",
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
		{
			Header: linkType,
			accessor: (p) =>
				language !== "ar" ? p.linkType?.name : p.linkType?.nameEnglish,
		},
		{
			Header: "Is Visible",
			accessor: (p) => <StatusIcon status={p.isVisible} />,
		},
		{
			Header: isExternalPath,
			accessor: (p) => <StatusIcon status={p.isExternalPath} />,
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
							redirectTo={`${RoutePath.CONTENT_MANAGEMENT_MENU_EDIT.replace(
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

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const parentSelectHandler = (option: DropdownOption) => {
		setParentId(option?.value!);
	};
	const menuTypeSelectHandler = (option: DropdownOption) => {
		setMenuTypeId(option?.value!);
	};

	const linkTypeSelectHandler = (option: DropdownOption) => {
		setLinkTypeId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		parentDropdown: {
			options: parentOptions,
			onSelect: parentSelectHandler,
		},
		menuTypeDropdown: {
			options: menuTypeOptions,
			onSelect: menuTypeSelectHandler,
		},
		linkTypeDropdown: {
			options: linkTypeOptions,
			onSelect: linkTypeSelectHandler,
		},
	};

	const activeStatusSelectHandler = (option: DropdownOption) => {
		setStatusCode(option?.value);
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
				dropdowns={dropdowns}
				onSearch={searchClickHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				hideWorkflowStatusDropdown={true}
				onActiveStatusOptionSelectionChange={activeStatusSelectHandler}
				// hideActiveStatusDropdown
			/>
		</>
	);
};

export default MenuTable;
