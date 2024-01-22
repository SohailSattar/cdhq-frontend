import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import {
	ActionsContainer,
	CheckBoxSelections,
	Dropdown,
	ExportSelection,
	Loader,
	LoaderOverlay,
	Modal,
	Pagination,
	SearchBox,
	ShadowedContainer,
	Table,
	TotalCount,
} from "..";
import { useStore } from "../../utils/store";
import { DropdownOption, Props as DropdownProps } from "../Dropdown";

import { getAccessRoles } from "../../api/roles/get/getAccessRoles";
import { getMyRole } from "../../api/users/get/getMyRole";
import { APIExportUser, APIUserRole } from "../../api/users/types";

import { ROLE } from "../../utils";

import { getAllWorkflowStatus } from "../../api/activeStatus/get/getAllWorkflowStatus";

import styles from "./styles.module.scss";
import { getProjectsList } from "../../api/projects/get/getProjectsList";
import { Portal } from "@mui/material";
import { APIExportData, PropertyDisplayNames } from "../../api";
interface Props {
	totalCountText: string;
	totalCount: number;
	currentPage?: number;
	setCurrentPage?: Dispatch<SetStateAction<number>>;
	pageSize: number;
	data: any;
	columns: Column<any>[];
	noRecordText: string;
	onSearch: (keyword: string) => void;
	onTableSort: (columneId: string, isSortedDesc: boolean) => void;
	onPageChange: (pageNo: number) => void;
	onPageViewSelectionChange: (option: DropdownOption) => void;
	showRoleOption?: boolean;
	showProjectDropdown?: boolean;
	hideWorkflowStatusDropdown?: boolean;
	activeStatusPlaceHolder?: string;
	hideActiveStatusDropdown?: boolean;
	dropdowns?: {
		[key: string]: DropdownProps;
	};
	onRoleOptonSelectionHandler?: (option: DropdownOption) => void;
	onProjectOptonSelectionHandler?: (option: DropdownOption) => void;
	onActiveStatusOptionSelectionChange?: (option: DropdownOption) => void;
	onWorkflowStatusOptionSelectionChange?: (option: DropdownOption) => void;
	columnsToHide?: string[];
	classNameTable?: string;
	isExportSelectionLoading?: boolean;
	displayExportButton?: boolean;
	exportDisplayNames?: any;
	onExcelExport?: (data: APIExportData) => void;
}

const PaginatedTable: FC<Props> = ({
	totalCountText = "",
	totalCount,
	currentPage = 1,
	setCurrentPage = () => {},
	pageSize,
	data,
	columns,
	noRecordText,
	onSearch,
	onTableSort,
	onPageChange,
	onPageViewSelectionChange,
	showRoleOption = false,
	showProjectDropdown = false,
	hideActiveStatusDropdown = false,
	activeStatusPlaceHolder,
	hideWorkflowStatusDropdown = true,
	dropdowns = {},
	onRoleOptonSelectionHandler = () => {},
	onProjectOptonSelectionHandler = () => {},
	onActiveStatusOptionSelectionChange = () => {},
	onWorkflowStatusOptionSelectionChange = () => {},
	columnsToHide = [],
	classNameTable,
	isExportSelectionLoading = false,
	displayExportButton = false,
	exportDisplayNames,
	onExcelExport = () => {},
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);
	const tableRef = useRef(null);
	const [myRole, setMyRole] = useState<APIUserRole>();

	const [page, setPage] = useState(currentPage);

	const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);

	const [projectsOptions, setProjectOptions] = useState<DropdownOption[]>([]);
	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([
		{ label: "", value: "" },
	]);

	const [activeStatusText, setActiveStatusText] = useState<string>("");

	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		if (activeStatusPlaceHolder) {
			setActiveStatusText(activeStatusPlaceHolder);
		} else {
			setActiveStatusText(
				t("global.status", {
					framework: "React",
				})
			);
		}
	}, [activeStatusPlaceHolder, t]);

	const activeStatusOptions: DropdownOption[] = [
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
			const { data: list } = await getProjectsList();
			if (list) {
				setProjectOptions(
					list?.map((x) => {
						return {
							label: `${x.id} - ${language !== "ar" ? x.name : x.nameEnglish}`,
							value: x.id,
						};
					})
				);
			}
		};
		if (showProjectDropdown) {
			fetch();
		}
	}, [language, setRoleOptions, showProjectDropdown]);

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
		if (showRoleOption) {
			fetch();
		}
	}, [setRoleOptions, showRoleOption]);

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
		if (!hideWorkflowStatusDropdown) {
			fetchData();
		}
	}, [hideWorkflowStatusDropdown, language, setStatusOptions]);

	const pageViewSelectionChangeHandler = (option: DropdownOption) => {
		if (option) {
			onPageViewSelectionChange(option);
		}
	};

	const pageChangeHandler = (page: number) => {
		setPage(page);
		setCurrentPage(page);
		onPageChange(page);
	};

	const roleSelectHandler = (option: DropdownOption) => {
		onRoleOptonSelectionHandler(option);
	};

	const projectSelectHandler = (option: DropdownOption) => {
		onProjectOptonSelectionHandler(option);
	};

	const workflowStatusOptionChangeHandler = (option: DropdownOption) => {
		onWorkflowStatusOptionSelectionChange(option);
	};

	const activeStatusOptionChangeHandler = (option: DropdownOption) => {
		onActiveStatusOptionSelectionChange(option);
	};

	return (
		<>
			<div className={styles.paginatedTable}>
				<ShadowedContainer className={styles.searchContainer}>
					<div className={styles.search}>
						<SearchBox
							onClick={onSearch}
							className={styles.noShadow}
						/>
					</div>
					<div className={styles.bar}>
						<div className={language !== "ar" ? styles.info : styles.infoLTR}>
							<TotalCount
								label={totalCountText}
								count={totalCount}
								className={styles.noShadow}
							/>
						</div>
					</div>

					{/* <Loader /> */}
				</ShadowedContainer>
				<ShadowedContainer className={styles.selectionContainer}>
					<div className={styles.detailBar}>
						<div
							className={
								language !== "ar" ? styles.selection : styles.selectionLTR
							}>
							<Dropdown
								options={pageViewOptions}
								onSelect={pageViewSelectionChangeHandler}
								placeholder={t("pagination.recordPerPage", {
									framework: "React",
								})}
							/>
						</div>
					</div>
					{myRole?.role.name === ROLE.SUPERADMIN && showRoleOption && (
						<div className={styles.detailBar}>
							<div
								className={
									language !== "ar" ? styles.selection : styles.selectionLTR
								}>
								<Dropdown
									options={roleOptions}
									onSelect={roleSelectHandler}
									placeholder={t("role.name", {
										framework: "React",
									})}
								/>{" "}
							</div>
						</div>
					)}
					{showProjectDropdown && (
						<div className={styles.detailBar}>
							<div
								className={
									language !== "ar" ? styles.selection : styles.selectionLTR
								}>
								<Dropdown
									options={projectsOptions}
									onSelect={projectSelectHandler}
									placeholder={t("dropdown.project", {
										framework: "React",
									})}
								/>{" "}
							</div>
						</div>
					)}
					{!hideWorkflowStatusDropdown && (
						<div className={styles.detailBar}>
							<div
								className={
									language !== "ar" ? styles.selection : styles.selectionLTR
								}>
								<Dropdown
									options={statusOptions}
									onSelect={workflowStatusOptionChangeHandler}
									placeholder={t("global.workflowStatus", {
										framework: "React",
									})}
								/>
							</div>
						</div>
					)}
					{Object.entries(dropdowns).map(([key, dropdownProps]) => (
						<div
							key={key}
							className={styles.detailBar}>
							<div
								className={
									language !== "ar" ? styles.selection : styles.selectionLTR
								}>
								<Dropdown {...dropdownProps} />
							</div>
						</div>
					))}{" "}
					{!hideActiveStatusDropdown && (
						<div className={styles.detailBar}>
							<div
								className={
									language !== "ar" ? styles.selection : styles.selectionLTR
								}>
								<Dropdown
									options={activeStatusOptions}
									onSelect={activeStatusOptionChangeHandler}
									placeholder={activeStatusText}
								/>{" "}
							</div>
						</div>
					)}
				</ShadowedContainer>
				<ActionsContainer
					showExport={displayExportButton}
					onExportClick={() => setIsOpen(true)}
				/>
				<Table
					reference={tableRef}
					columns={columns}
					data={data}
					onSort={onTableSort}
					noRecordsText={noRecordText}
					columnsToHide={columnsToHide}
					className={classNameTable}
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
			<Portal>
				<Modal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}>
					<LoaderOverlay loading={isExportSelectionLoading}>
						<ExportSelection
							displayNames={exportDisplayNames}
							onExcelExport={onExcelExport}
						/>
					</LoaderOverlay>
				</Modal>
			</Portal>
		</>
	);
};

export default PaginatedTable;
