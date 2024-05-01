import { useTranslation } from "react-i18next";
import { PaginatedTable, RedirectButton, StatusIcon } from "../..";
import { useStore } from "../../../utils/store";
import { useEffect, useState } from "react";
import { APILinkTypeDetail } from "../../../api/linkTypes/types";
import { getLinkTypesPaginated } from "../../../api/linkTypes/get/getLinkTypesPaginated";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { CivilDefenseBuildingColumns } from "../../PaginatedTable/types";
import { Column } from "@tanstack/react-table";
import { getPagedCdBuildings } from "../../../api/civilDefenseBuildings/get/getPagedCdBuildings";
import { APICivilDefenseBuildingItem } from "../../../api/civilDefenseBuildings/types";
import { Id } from "../../../utils";
import { getCdBuildingsOwners } from "../../../api/civilDefenseBuildingsOwners/get/getCdBuildingsOwners";

const CivilDefenseBuildingsTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APICivilDefenseBuildingItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [ownerId, setOwnerId] = useState<Id>("");

	const [ownerOptions, setOwnerOptions] = useState<DropdownOption[]>([]);

	// This variable is to set the status code which we can pass to the API
	const [statusCode, setStatusCode] = useState<Id>(1);

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("Id");
	const [toggleSort, setToggleSort] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getPagedCdBuildings(
				currentPage,
				pageSize,
				keyword,
				ownerId,
				statusCode,
				orderBy,
				toggleSort
			);
			if (data) {
				setItems(data.buildings);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [
		currentPage,
		keyword,
		orderBy,
		ownerId,
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

	const id = t("global.id", { framework: "React" });
	const name = t("cd.building.name", { framework: "React" });
	const nameEng = t("cd.building.nameEnglish", { framework: "React" });
	const owner = t("cd.owner.name", { framework: "React" });
	const section = t("department.section", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	// const columns: Column<CivilDefenseBuildingColumns>[] = [
	// 	{
	// 		Header: id,
	// 		id: "id",
	// 		accessor: (p) => p.id,
	// 	},
	// 	{
	// 		Header: name,
	// 		id: "name",
	// 		accessor: (p) => p.name,
	// 	},
	// 	{
	// 		Header: nameEng,
	// 		id: "nameEnglish",
	// 		accessor: (p) => p.nameEnglish,
	// 	},
	// 	{
	// 		Header: owner,
	// 		id: "owner",
	// 		accessor: (p) =>
	// 			language !== "ar" ? p.owner?.name! : p.owner?.nameEnglish!,
	// 	},
	// 	{
	// 		Header: section,
	// 		id: "section",
	// 		accessor: (p) =>
	// 			language !== "ar" ? p.section?.name! : p.section?.nameEnglish!,
	// 	},
	// 	{
	// 		Header: actions,
	// 		accessor: (p) => p.id,
	// 		Cell: ({ value }: any) => (
	// 			<div className={styles.action}>
	// 				<div className={styles.btnDiv}>
	// 					<RedirectButton
	// 						label={edit}
	// 						redirectTo={`${RoutePath.CONTENT_MANAGEMENT_CD_BUILDING_EDIT.replace(
	// 							RoutePath.ID,
	// 							value
	// 						)}`}
	// 						// style={{ height: "20px", fontSize: "12px" }}
	// 					/>
	// 				</div>
	// 			</div>
	// 		),
	// 	},
	// ];

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

	const ownerSelectHandler = (option: DropdownOption) => {
		setOwnerId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		owners: {
			options: ownerOptions,
			onSelect: ownerSelectHandler,
			placeholder: t("cd.owner.name", { framework: "React" }),
		},
	};

	return (
		<>
			{/* <PaginatedTable
				totalCountText={t("menu.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={items}
				columns={columns}
				dropdowns={dropdowns}
				noRecordText={""}
				onSearch={searchClickHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				hideWorkflowStatusDropdown={true}
				onActiveStatusOptionSelectionChange={activeStatusChangeHandler}
			/> */}
		</>
	);
};

export default CivilDefenseBuildingsTable;
