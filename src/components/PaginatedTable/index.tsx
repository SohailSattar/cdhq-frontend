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
import { getProjectsList } from "../../api/projects/get/getProjectsList";
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
	onRoleOptonSelectionHandler?: (option: DropdownOption) => void;
	onProjectOptonSelectionHandler?: (option: DropdownOption) => void;
	onActiveStatusOptionSelectionChange?: (option: DropdownOption) => void;
	onWorkflowStatusOptionSelectionChange?: (option: DropdownOption) => void;
	columnsToHide?: string[];
	classNameTable?: string;
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
	onRoleOptonSelectionHandler = () => {},
	onProjectOptonSelectionHandler = () => {},
	onActiveStatusOptionSelectionChange = () => {},
	onWorkflowStatusOptionSelectionChange = () => {},
	columnsToHide = [],
	classNameTable,
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
		<div className={styles.paginatedTable}>
			<div
				className={styles.searchContainer}
				style={{ marginTop: 0 }}>
				<div className={styles.search}>
					<SearchBox onClick={onSearch} />
				</div>
				<div className={styles.bar}>
					<div className={language !== "ar" ? styles.info : styles.infoLTR}>
						<TotalCount
							label={totalCountText}
							count={totalCount}
						/>
					</div>
				</div>
			</div>
			<div className={styles.selectionContainer}>
				{/* <div className={styles.detailBar}>
					<div className={language !== "ar" ? styles.info : styles.infoLTR}>
						<TotalCount
							label={totalCountText}
							count={totalCount}
						/>
					</div>
				</div> */}
				<div className={styles.detailBar}>
					<div
						className={
							language !== "ar" ? styles.selection : styles.selectionLTR
						}>
						<ShadowedContainer>
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
				{showProjectDropdown && (
					<div className={styles.detailBar}>
						<div
							className={
								language !== "ar" ? styles.selection : styles.selectionLTR
							}>
							<ShadowedContainer>
								<Dropdown
									options={projectsOptions}
									onSelect={projectSelectHandler}
									placeholder={t("project.name", {
										framework: "React",
									})}
								/>{" "}
							</ShadowedContainer>
						</div>
					</div>
				)}
				{!hideWorkflowStatusDropdown && (
					<div className={styles.detailBar}>
						<div
							className={
								language !== "ar" ? styles.selection : styles.selectionLTR
							}>
							<ShadowedContainer>
								<Dropdown
									options={statusOptions}
									onSelect={workflowStatusOptionChangeHandler}
									placeholder={t("global.workflowStatus", {
										framework: "React",
									})}
								/>{" "}
							</ShadowedContainer>
						</div>
					</div>
				)}
				{!hideActiveStatusDropdown && (
					<div className={styles.detailBar}>
						<div
							className={
								language !== "ar" ? styles.selection : styles.selectionLTR
							}>
							<ShadowedContainer>
								<Dropdown
									options={activeStatusOptions}
									onSelect={activeStatusOptionChangeHandler}
									placeholder={activeStatusText}
								/>{" "}
							</ShadowedContainer>
						</div>
					</div>
				)}
			</div>
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
	);
};

export default PaginatedTable;
