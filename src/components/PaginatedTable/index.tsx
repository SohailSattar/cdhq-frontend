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

import { getAccessRoles } from "../../api/roles/get/getAccessRoles";
import { getMyRole } from "../../api/users/get/getMyRole";
import { APIUserRole } from "../../api/users/types";

import { ROLE } from "../../utils";

import { getAllWorkflowStatus } from "../../api/activeStatus/get/getAllWorkflowStatus";

import styles from "./styles.module.scss";
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
	showRoleOption?: boolean;
	hideWorkflowStatusDropdown?: boolean;
	hideActiveStatusDropdown?: boolean;
	onRoleOptonSelectionHandler?: (option: DropdownOption) => void;
	onActiveStatusOptionSelectionChange: (option: DropdownOption) => void;
	onWorkflowStatusOptionSelectionChange: (option: DropdownOption) => void;
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
	showRoleOption = false,
	hideActiveStatusDropdown = false,
	hideWorkflowStatusDropdown = false,
	onRoleOptonSelectionHandler = () => {},
	onActiveStatusOptionSelectionChange,
	onWorkflowStatusOptionSelectionChange,
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);
	const tableRef = useRef(null);
	const [myRole, setMyRole] = useState<APIUserRole>();

	const [currentPage, setCurrentPage] = useState(1);

	const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);

	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([
		{ label: "", value: "" },
	]);

	const activeStatusOptions: DropdownOption[] = [
		{ label: "Active", value: 1 },
		{ label: "Deactive", value: 9 },
	];

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
		const fetch = async () => {
			const { data } = await getMyRole();
			if (data) {
				setMyRole(data);

				if (data?.role?.name === ROLE.SUPERADMIN) {
					const { data: roles } = await getAccessRoles();
					if (roles) {
						setRoleOptions(
							roles?.map((x) => {
								return { label: x.name, value: x.id };
							})
						);
					}
				}
			}
		};

		fetch();
	}, [setRoleOptions]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getAllWorkflowStatus();
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

		fetchData();
	}, [setStatusOptions]);

	const pageViewSelectionChangeHandler = (option: DropdownOption) => {
		onPageViewSelectionChange(option);
	};

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	const roleSelectHandler = (option: DropdownOption) => {
		onRoleOptonSelectionHandler(option);
	};

	const workflowStatusOptionChangeHandler = (option: DropdownOption) => {
		onWorkflowStatusOptionSelectionChange(option);
	};

	const activeStatusOptionChangeHandler = (option: DropdownOption) => {
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
			{myRole?.role.name === ROLE.SUPERADMIN && showRoleOption && (
				<div className={styles.detailBar}>
					<div
						className={
							language !== "ar" ? styles.selection : styles.selectionLTR
						}>
						<ShadowedContainer>
							<Dropdown
								options={roleOptions}
								onSelect={roleSelectHandler}
								placeholder={t("role.name", {
									framework: "React",
								})}
							/>{" "}
						</ShadowedContainer>
					</div>
				</div>
			)}
			<div className={styles.detailBar}>
				{!hideWorkflowStatusDropdown && (
					<div
						className={
							language !== "ar" ? styles.selection : styles.selectionLTR
						}>
						<ShadowedContainer>
							<Dropdown
								options={statusOptions}
								onSelect={workflowStatusOptionChangeHandler}
								placeholder={t("global.status", {
									framework: "React",
								})}
							/>{" "}
						</ShadowedContainer>
					</div>
				)}{" "}
				{!hideActiveStatusDropdown && (
					<div
						className={
							language !== "ar" ? styles.selection : styles.selectionLTR
						}>
						<ShadowedContainer>
							<Dropdown
								options={activeStatusOptions}
								onSelect={activeStatusOptionChangeHandler}
								placeholder={t("global.activeStatus", {
									framework: "React",
								})}
							/>{" "}
						</ShadowedContainer>
					</div>
				)}
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
