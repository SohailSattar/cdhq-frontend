import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { APIEmployeeHistory } from "../../../api/employees/types";
import { useEffect, useMemo, useState } from "react";
import { getPagedEmployeeHistory } from "../../../api/employees/get/getPagedEmployeeHistory";
import { EmployeeHistoryColumns } from "../../PaginatedTable/types";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";
import { PaginatedTable } from "../..";
import { DropdownOption } from "../../Dropdown";

const EmployeeHistoryTable = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APIEmployeeHistory[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("Id");
	const [toggleSort, setToggleSort] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getPagedEmployeeHistory(310009138, {
				page: currentPage,
				postsPerPage: pageSize,
				orderBy,
				isDescending: toggleSort,
			});
			if (data) {
				setItems(data.changes);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [currentPage, orderBy, pageSize, toggleSort]);

	const name = t("history.name", { framework: "React" });
	const updatedBy = t("history.changedByEmpNo", { framework: "React" });
	const fieldName = t("history.fieldName", { framework: "React" });
	const oldValue = t("history.oldValue", { framework: "React" });
	const newValue = t("history.newValue", { framework: "React" });
	const auditDate = t("history.auditDate", { framework: "React" });

	const columnHelper = createColumnHelper<EmployeeHistoryColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.name, {
				id: "name",
				header: name,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.updatedBy, {
				id: "updatedBy",
				header: updatedBy,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.fieldName, {
				id: "fieldName",
				header: fieldName,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.oldValue, {
				id: "oldValue",
				header: oldValue,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.newValue, {
				id: "newValue",
				header: newValue,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.auditDate, {
				id: "auditDate",
				header: auditDate,
				cell: (info) => {
					format(new Date(info.getValue()!), "dd MMMM yyyy", {
						locale: language !== "ar" ? ar : enGB,
					});
				},
				enableColumnFilter: false,
			}),
		],
		[
			auditDate,
			columnHelper,
			fieldName,
			language,
			name,
			newValue,
			oldValue,
			updatedBy,
		]
	);

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
				noRecordText={t("table.noResult", { framework: "React" })}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				hideActiveStatusDropdown
				showSearchBar={false}
				hideWorkflowStatusDropdown={true}
			/>
		</>
	);
};

export default EmployeeHistoryTable;
