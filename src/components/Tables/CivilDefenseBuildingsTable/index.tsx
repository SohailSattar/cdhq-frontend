import { useTranslation } from "react-i18next";
import { PaginatedTable, RedirectButton, StatusIcon } from "../..";
import { useStore } from "../../../utils/store";
import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { APILinkTypeDetail } from "../../../api/linkTypes/types";
import { getLinkTypesPaginated } from "../../../api/linkTypes/get/getLinkTypesPaginated";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { CivilDefenseBuildingColumns } from "../../PaginatedTable/types";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { getPagedCdBuildings } from "../../../api/civilDefenseBuildings/get/getPagedCdBuildings";
import { APICivilDefenseBuildingItem } from "../../../api/civilDefenseBuildings/types";
import { Id } from "../../../utils";
import { getCdBuildingsOwners } from "../../../api/civilDefenseBuildingsOwners/get/getCdBuildingsOwners";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import { getFilteredCdBuildings } from "../../../api/civilDefenseBuildings/get/getFilteredCdBuildings";

const CivilDefenseBuildingsTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APICivilDefenseBuildingItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [ownerOptions, setOwnerOptions] = useState<DropdownOption[]>([]);
	const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);

	// This variable is to set the status code which we can pass to the API
	const [statusCode, setStatusCode] = useState<Id>(1);

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("Id");
	const [toggleSort, setToggleSort] = useState(true);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getFilteredCdBuildings(columnFilters, {
				page: currentPage,
				postsPerPage: pageSize,
				keyword,
				statusCode,
				orderBy,
				isDescending: toggleSort,
			});
			if (data) {
				setItems(data.buildings);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [
		columnFilters,
		currentPage,
		keyword,
		orderBy,
		pageSize,
		statusCode,
		toggleSort,
	]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getCdBuildingsOwners();

			if (data) {
				setOwnerOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	const fetchDpartments = useCallback(async () => {
		const { data } = await getCategorizedDepartments();

		if (data) {
			setSectionOptions(
				data?.map((d) => {
					return {
						label: `${d.id} - ${
							language !== "ar" ? d.fullName : d.fullNameEnglish
						}`,
						value: d.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchDpartments();
	}, [fetchDpartments]);

	const id = t("global.id", { framework: "React" });
	const name = t("cd.building.name", { framework: "React" });
	const nameEng = t("cd.building.nameEnglish", { framework: "React" });
	const owner = t("cd.owner.name", { framework: "React" });
	const section = t("department.section", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const columnHelper = createColumnHelper<CivilDefenseBuildingColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: id,
			}),
			columnHelper.accessor((row) => row.name, {
				id: "name",
				header: name,
			}),
			columnHelper.accessor((row) => row.nameEnglish, {
				id: "nameEnglish",
				header: nameEng,
			}),
			columnHelper.accessor((row) => row.owner, {
				id: "ownerId",
				header: owner,
				cell: (info) =>
					language !== "ar"
						? info.getValue().name!
						: info.getValue().nameEnglish!,
				meta: {
					filterVariant: "select",
					options: ownerOptions,
				},
			}),
			columnHelper.accessor((row) => row.section, {
				id: "sectionId",
				header: section,
				cell: (info) =>
					language !== "ar"
						? info.getValue()?.name!
						: info.getValue()?.nameEnglish!,
				meta: {
					filterVariant: "select",
					options: sectionOptions,
				},
			}),
			columnHelper.accessor((row) => row.id, {
				id: "actions",
				header: actions,
				cell: (info) => (
					<div className={styles.action}>
						<div className={styles.btnDiv}>
							<RedirectButton
								label={edit}
								redirectTo={`${RoutePath.CONTENT_MANAGEMENT_CD_BUILDING_EDIT.replace(
									RoutePath.ID,
									info.getValue().toString()
								)}`}
								// style={{ height: "20px", fontSize: "12px" }}
							/>
						</div>
					</div>
				),
				enableColumnFilter: false,
			}),
		],
		[
			actions,
			columnHelper,
			edit,
			id,
			language,
			name,
			nameEng,
			owner,
			ownerOptions,
			section,
			sectionOptions,
		]
	);

	const searchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);
		setOrderBy(columnId);
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

	const activeStatusChangeHandler = (option: DropdownOption) => {
		setStatusCode(option?.value);
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
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
				hideWorkflowStatusDropdown={true}
				onActiveStatusOptionSelectionChange={activeStatusChangeHandler}
				onColumnFiltersChange={handleColumnFiltersChange}
			/>
		</>
	);
};

export default CivilDefenseBuildingsTable;
