import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import {
	Dropdown,
	Pagination,
	SearchBox,
	ShadowedContainer,
	Table,
	TotalCount,
} from "..";
import { useStore } from "../../utils/store";
import { DropdownOption } from "../Dropdown";

import styles from "./styles.module.scss";
import { getActiveStatus } from "../../api/activeStatus/get/getActiveStatus";
import { getAllActiveStatus } from "../../api/activeStatus/get/getAllActiveStatus";

interface Props {
	totalCountText: string;
	totalCount: number;
	pageSize: number;
	data: any;
	columns: Column<any>[];
	noRecordText: string;
	onSearch: (keyword: string) => void;
	onTableSort: (columneId: string, isSortedDesc: boolean) => void;
	onPageChange: (pageNo: number) => void;
	onPageViewSelectionChange: (option: DropdownOption) => void;
	onActiveStatusOptionSelectionChange: (option: DropdownOption) => void;
}

const PaginatedTable: FC<Props> = ({
	totalCountText = "",
	totalCount,
	pageSize,
	data,
	columns,
	noRecordText,
	onSearch,
	onTableSort,
	onPageChange,
	onPageViewSelectionChange,
	onActiveStatusOptionSelectionChange,
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const tableRef = useRef(null);

	const [currentPage, setCurrentPage] = useState(1);

	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([
		{ label: "", value: "" },
	]);

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

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getAllActiveStatus();
			if (data) {
				setStatusOptions(
					data?.map((d) => {
						return {
							label: language !== "ar" ? d.nameArabic : d.nameEnglish,
							value: d.id,
						};
					})
				);
			}
		};

		console.log("xx");

		fetchData();
	}, [setStatusOptions]);

	const pageViewSelectionChangeHandler = (option: DropdownOption) => {
		onPageViewSelectionChange(option);
	};

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	const statusOptionChangeHandler = (option: DropdownOption) => {
		onActiveStatusOptionSelectionChange(option);
	};

	return (
		<div className={styles.paginatedTable}>
			<div style={{ marginTop: 0 }}>
				<SearchBox onClick={onSearch} />
			</div>
			<div className={styles.detailBar}>
				<div className={language !== "ar" ? styles.info : styles.infoLTR}>
					<TotalCount
						label={totalCountText}
						count={totalCount}
					/>
				</div>
				<div
					className={
						language !== "ar" ? styles.selection : styles.selectionLTR
					}>
					<ShadowedContainer className={styles.box}>
						<Dropdown
							options={pageViewOptions}
							onSelect={pageViewSelectionChangeHandler}
							placeholder={t("pagination.recordPerPage", {
								framework: "React",
							})}
						/>
					</ShadowedContainer>
				</div>
			</div>
			<div>
				<ShadowedContainer>
					<Dropdown
						options={statusOptions}
						onSelect={statusOptionChangeHandler}
						placeholder={t("pagination.recordPerPage", {
							framework: "React",
						})}
					/>{" "}
				</ShadowedContainer>
			</div>
			<Table
				reference={tableRef}
				columns={columns}
				data={data}
				onSort={onTableSort}
				noRecordsText={noRecordText}
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
