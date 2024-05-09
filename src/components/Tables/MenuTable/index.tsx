import { useCallback, useEffect, useMemo, useState } from "react";
import { getMenuListPaginated } from "../../../api/menu/get/getMenuListPaginated";
import PaginatedTable from "../../PaginatedTable";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";
import { MenuItemColumns } from "../../PaginatedTable/types";
import { Column, createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ActionButtons, ActiveStatus, RedirectButton, StatusIcon } from "../..";
import { APIMenuItemDetail } from "../../../api/menu/types";

import * as RoutePath from "../../../RouteConfig";

import { useStore } from "../../../utils/store";

import { getAllMenuTypes } from "../../../api/menuTypes/get/getAllMenuTypes";
import { APIType } from "../../../api/menuTypes/types";
import { getLinkTypes } from "../../../api/linkTypes/get/getLinkTypes";
import { getParentMenuItems } from "../../../api/menu/get/getParentMenuItems";
import { Id, toast } from "react-toastify";
import { APIStatus } from "../../../api";
import { updateMenuItemStatus } from "../../../api/menu/update/updateMenuItemStatus";
import { useNavigate } from "react-router-dom";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

import styles from "./styles.module.scss";

const MenuTable = () => {
	const navigate = useNavigate();
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [parentOptions, setParentOptions] = useState<DropdownOption[]>([]);
	const [menuTypeOptions, setMenuTypeOptions] = useState<DropdownOption[]>([]);
	const [linkTypeOptions, setLinkTypeOptions] = useState<DropdownOption[]>([]);

	const [items, setItems] = useState<APIMenuItemDetail[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [statusCode, setStatusCode] = useState<Id>("1");

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
			const { data: privilege } = await getProjectPrivilege(
				Project.ContentManagement
			);
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
			}
		};

		fetch();
	}, [setPrivileges]);

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

	const fetch = useCallback(async () => {
		const { data } = await getMenuListPaginated(
			currentPage,
			pageSize,
			keyword,
			statusCode,
			orderBy,
			toggleSort
		);

		if (data) {
			setItems(data.menuItems);
			setTotalCount(data.totalItems);
			setPageSize(data?.pageSize);
		}
	}, [currentPage, keyword, orderBy, pageSize, statusCode, toggleSort]);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

			const { data, error } = await updateMenuItemStatus(params);

			if (data) {
				fetch();
				toast.success(
					t("message.recordActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
		},
		[fetch, t]
	);

	const editClickHandler = useMemo(
		() => (id: string) => {
			navigate(`${RoutePath.CONTENT_MANAGEMENT_IMAGE}/${id}/edit`);
		},
		[navigate]
	);

	const deleteClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 9,
			};

			const { data, error } = await updateMenuItemStatus(params);

			if (data) {
				fetch();
				toast.error(
					t("message.recordDeactivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
		},
		[fetch, t]
	);

	const id = t("menu.id", { framework: "React" });
	const menuType = t("menu.menuType", { framework: "React" });
	const menuName = t("menu.name", { framework: "React" });
	const parent = t("menu.parent", { framework: "React" });
	const linkPath = t("menu.pathLink", { framework: "React" });
	const orderNo = t("menu.orderNo", { framework: "React" });
	const linkType = t("menu.linkType", { framework: "React" });

	const isVisible = t("menu.isVisible", { framework: "React" });

	const isExternalPath = t("menu.isExternal", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

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

	const columnHelper = createColumnHelper<MenuItemColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: id,
			}),
			columnHelper.accessor((row) => row.menuType, {
				id: "menuTypeId",
				header: menuType,
				cell: (info) =>
					info.getValue() ? (
						<div className={styles.name}>
							{language !== "ar"
								? info.getValue()!.name
								: info.getValue()!.nameEnglish}
						</div>
					) : (
						<div>-</div>
					),
				meta: {
					filterVariant: "select",
					options: menuTypeOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "fullName",
				header: menuName,
				cell: (info) => (
					<div className={styles.name}>
						{language !== "ar"
							? info.getValue().name!
							: info.getValue().nameEnglish!}
					</div>
				),
			}),
			columnHelper.accessor((row) => row.parent, {
				id: "parentId",
				header: parent,
				cell: (info) =>
					info.getValue() ? (
						<div className={styles.name}>
							{language !== "ar"
								? info.getValue()!.name
								: info.getValue()!.nameEnglish}
						</div>
					) : (
						<div>-</div>
					),
				meta: {
					filterVariant: "select",
					options: parentOptions,
				},
			}),
			columnHelper.accessor((row) => row.linkPath, {
				id: "linkPath",
				header: linkPath,
			}),
			columnHelper.accessor((row) => row.orderNo, {
				id: "orderNo",
				header: orderNo,
			}),
			columnHelper.accessor((row) => row.linkType, {
				id: "linkTypeId",
				header: linkType,
				cell: (info) =>
					info.getValue() ? (
						<div className={styles.name}>
							{language !== "ar"
								? info.getValue()!.name
								: info.getValue()!.nameEnglish}
						</div>
					) : (
						<div>-</div>
					),
				meta: {
					filterVariant: "select",
					options: linkTypeOptions,
				},
			}),
			columnHelper.accessor((row) => row.isVisible, {
				id: "isVisible",
				header: isVisible,
				cell: (info) => <StatusIcon status={info.getValue()} />,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.isExternalPath, {
				id: "isExternal",
				header: isExternalPath,
				cell: (info) => <StatusIcon status={info.getValue()} />,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.activeStatus, {
				id: "activeStatusId",
				header: status,
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>
							<ActiveStatus
								code={info.getValue()!.id === 1 ? 1 : 9}
								text={
									language !== "ar"
										? info.getValue()!.nameArabic
										: info.getValue()!.nameEnglish
								}
							/>
						</div>
					</div>
				),
				meta: {
					filterVariant: "select",
					options: activeStatusOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "actions",
				header: actions,
				cell: (info) => (
					<ActionButtons
						id={info.getValue().id}
						editPageLink={`${RoutePath.CONTENT_MANAGEMENT_MENU_EDIT.replace(
							RoutePath.ID,
							info.getValue().id.toString()
						)}`}
						showActivate={info.getValue().activeStatus?.id !== 1}
						onActivate={(id) => activateClickHandler(id)}
						showEdit={true}
						onEdit={(id) => editClickHandler(id)}
						showDelete={
							privileges?.deletePrivilege &&
							info.getValue().activeStatus?.id === 1
						}
						onDelete={deleteClickHandler}
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
			editClickHandler,
			id,
			isExternalPath,
			isVisible,
			language,
			linkPath,
			linkType,
			linkTypeOptions,
			menuName,
			menuType,
			menuTypeOptions,
			orderNo,
			parent,
			parentOptions,
			privileges?.deletePrivilege,
			status,
		]
	);

	const searchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		let orderByParam = "";
		setToggleSort(!toggleSort);
		setOrderBy(columnId);
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

	const dropdowns: { [key: string]: DropdownProps } = {
		// parentDropdown: {
		// 	options: parentOptions,
		// 	onSelect: parentSelectHandler,
		// },
		// menuTypeDropdown: {
		// 	options: menuTypeOptions,
		// 	onSelect: menuTypeSelectHandler,
		// },
		// linkTypeDropdown: {
		// 	options: linkTypeOptions,
		// 	onSelect: linkTypeSelectHandler,
		// },
	};

	const activeStatusSelectHandler = (option: DropdownOption) => {
		setStatusCode(option?.value);
	};

	return (
		<div className={styles.menuItem}>
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
		</div>
	);
};

export default MenuTable;
