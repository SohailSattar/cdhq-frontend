import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import {
	Button,
	Dropdown,
	Pagination,
	RedirectButton,
	SearchBox,
	ShadowedContainer,
	Table,
	TotalCount,
} from "..";
import { useStore } from "../../utils/store";
import { DropdownOption } from "../Dropdown";

import styles from "./styles.module.scss";

interface Props {
	totalCountText?: string;
	totalCount: number;
	pageSize: number;
	data: any;
	columns: Column<any>[];
	onSearch: (keyword: string) => void;
	onTableSort: (columneId: string, isSortedDesc: boolean) => void;
	onPageChange: (pageNo: number) => void;
	onPageViewSelectionChange: (option: DropdownOption) => void;
	displayActionsColumn?: boolean;
}

const PaginatedTable: FC<Props> = ({
	totalCountText = "",
	totalCount,
	pageSize,
	data,
	columns,
	onSearch,
	onTableSort,
	onPageChange,
	onPageViewSelectionChange,
	displayActionsColumn = true,
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const tableRef = useRef(null);

	const [currentPage, setCurrentPage] = useState(1);

	const pageViewOptions: DropdownOption[] = [
		{ label: "10", value: 10 },
		{ label: "15", value: 15 },
		{ label: "20", value: 20 },
		{ label: "25", value: 25 },
		{ label: "30", value: 30 },
		{ label: "35", value: 35 },
		{ label: "40", value: 40 },
		{ label: "45", value: 45 },
		{ label: "50", value: 50 },
	];

	const pageViewSelectionChangeHandler = (option: DropdownOption) => {
		onPageViewSelectionChange(option);
	};

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	return (
		<div className={styles.paginatedTable}>
			<div style={{ marginTop: 0 }}>
				<SearchBox onClick={onSearch} />
			</div>
			<div className={styles.detailBar}>
				<div className={language !== "ar" ? styles.info : styles.infoLTR}>
					<TotalCount
						label={t("user.count", { framework: "React" })}
						count={totalCount}
					/>
				</div>
				<div
					className={language !== "ar" ? styles.selection : styles.selectionLTR}
				>
					<ShadowedContainer className={styles.box}>
						<Dropdown
							options={pageViewOptions}
							onSelect={pageViewSelectionChangeHandler}
							placeholder={
								totalCountText === ""
									? t("pagination.recordPerPage", { framework: "React" })
									: totalCountText
							}
						/>
					</ShadowedContainer>
				</div>
			</div>
			<Table
				reference={tableRef}
				columns={columns}
				data={data}
				onSort={onTableSort}
				noRecordsText={t("table.noUser", { framework: "React" })}
				// columnsToHide={
				// 	displayActionsColumn
				// 		? []
				// 		: [columns[columns.length - 1].Header!.toString()]
				// }
			/>
			<div>
				<Pagination
					className={styles.paginationBar}
					currentPage={currentPage}
					totalCount={totalCount}
					pageSize={pageSize}
					onPageChange={(page) => pageChangeHandler(page)}
				/>
			</div>
		</div>
	);
};

export default PaginatedTable;
