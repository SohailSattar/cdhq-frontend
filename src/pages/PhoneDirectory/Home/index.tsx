import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { toast } from "react-toastify";
import { enGB, ar } from "date-fns/locale";
import { APIPrivileges } from "../../../api/privileges/type";
import {
	Button,
	DepartmentTree,
	Modal,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import {
	DropdownOption,
	Props as DropdownProps,
} from "../../../components/Dropdown";
import { PhoneForm, IPhoneFormInputs } from "../../../components";
import { PhoneDirectoryColumns } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";
import { useStore } from "../../../utils/store";

import {
	APIPhoneDetail,
	APIPhoneDirectory,
} from "../../../api/phoneDirectory/types";

import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { updatePhoneDetails } from "../../../api/phoneDirectory/update/updatePhoneDetails";
import { getPhoneDirectoryByDepartment } from "../../../api/phoneDirectory/get/getPhoneDirectoryByDepartment";
import { getPhoneDirectoryList } from "../../../api/phoneDirectory/get/getPhoneDirectoryList";

import styles from "./styles.module.scss";
import { getEmployeeStatuses } from "../../../api/employees/get/getEmployeeStatuses";
import { Id } from "../../../utils";

const PhoneDirectoryPage = () => {
	const language = useStore((state) => state.language);
	const [t] = useTranslation("common");

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [employees, setEmployees] = useState<APIPhoneDirectory[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");
	const [departmentIds, setDepartmentIds] = useState<string[]>([]);
	const [statusId, setStatusId] = useState<Id>("");

	const [currentPage, setCurrentPage] = useState(1);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<APIPhoneDirectory>();

	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([]);

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const fullName = t("user.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });
	const phone = t("user.phone", { framework: "React" });
	const phoneOffice = t("user.phoneOffice", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
	const [orderBy, setOrderBy] = useState<string>("rankId");

	const columns: Column<PhoneDirectoryColumns>[] = useMemo(
		() => [
			{
				Header: employeeNo,
				id: "employeeNo",
				accessor: (p) => p.employeeNo,
				Cell: ({ value }: any) => <div className={styles.name}>{value}</div>,
			},
			{
				Header: rank,
				id: "rankId",
				accessor: (p) => p.rank,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar" ? value.name : value.nameEnglish}
					</div>
				),
			},
			{
				Header: fullName,
				id: "name",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar" ? value?.name! : value?.nameEnglish!}
					</div>
				),
			},
			{
				Header: department,
				id: "departmentId",
				accessor: (p) => p.department,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar" ? value?.name! : value?.nameEnglish!}
					</div>
				),
			},
			{
				Header: phone,
				id: "phone",
				accessor: (p) => p.phone,
			},
			{
				Header: phone,
				id: "phone2",
				accessor: (p) => p.phone2,
			},
			{
				Header: phoneOffice,
				id: "phoneOffice",
				accessor: (p) => p.phoneOffice,
			},
			{
				Header: actions,
				accessor: (p) => p,
				Cell: ({ row, value }: any) => (
					<div className={styles.action}>
						<div
							className={language !== "ar" ? styles.btnDiv : styles.btnDivLTR}>
							{privileges?.updatePrivilege! === true && (
								<Button
									onClick={() => {
										editClickHandler(row.values.name!);
									}}
									style={{ height: "20px", fontSize: "12px" }}>
									{edit}
								</Button>
							)}
						</div>
					</div>
				),
			},
		],
		[
			employeeNo,
			rank,
			fullName,
			department,
			phone,
			phoneOffice,
			actions,
			language,
			privileges?.updatePrivilege,
			edit,
		] //role
	);

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const fetchData = useMemo(
		() => async (currentPage: number) => {
			// Check Privilege
			const { data: privilege, error } = await getProjectPrivilege(
				Project.PhoneDirectory
			);

			if (error) {
				// toast.success(
				// 	t("message.projectUpdated", { framework: "React" }).toString()
				// );
			}

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

			if (privilege?.readPrivilege) {
				const { data } = await getPhoneDirectoryList(
					currentPage,
					pageSize,
					keyword,
					statusId,
					orderBy,
					toggleSort
				);

				if (data) {
					setEmployees(data?.employees!);
					setTotalCount(data?.totalItems!);
				}
			}
		},
		[pageSize, keyword, statusId, orderBy, toggleSort]
	);

	const fetchByDepartment = useMemo(
		() => async () => {
			// Check Privilege
			const { data: privilege, error } = await getProjectPrivilege(
				Project.PhoneDirectory
			);

			if (error) {
				// toast.success(
				// 	t("message.projectUpdated", { framework: "React" }).toString()
				// );
			}

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

			if (privilege?.readPrivilege) {
				const { data } = await getPhoneDirectoryByDepartment(
					currentPage,
					pageSize,
					keyword,
					departmentIds,
					statusId,
					orderBy,
					toggleSort
				);

				if (data) {
					setEmployees(data?.employees!);
					setTotalCount(data?.totalItems!);
				}
			}
		},
		[
			currentPage,
			pageSize,
			keyword,
			departmentIds,
			statusId,
			orderBy,
			toggleSort,
		]
	);

	const fetchStatuses = useMemo(
		() => async () => {
			const { data } = await getEmployeeStatuses();

			if (data) {
				setStatusOptions(
					data?.map((x) => {
						return {
							label: `${language !== "ar" ? x.name : x.nameEnglish}`,
							value: x.id,
						};
					})
				);
			}
		},
		[language]
	);

	useEffect(() => {
		if (departmentIds.length === 0) {
			fetchData(currentPage);
		} else {
			fetchByDepartment();
		}
	}, [fetchData, currentPage, departmentIds.length, fetchByDepartment]);

	useEffect(() => {
		fetchStatuses();
	}, [fetchStatuses]);

	const userSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const editClickHandler = (selectedItem: APIPhoneDirectory) => {
		setIsPopupOpen(true);
		setSelectedRow(selectedItem);
	};

	const recordUpdateHandler = async (values: IPhoneFormInputs) => {
		const { id, phone, phone2, phoneOffice } = values;

		const params: APIPhoneDetail = {
			id: id!,
			phone: phone,
			phone2: phone2,
			phoneOffice: phoneOffice,
		};

		const { data } = await updatePhoneDetails(params);
		if (data) {
			toast.success(
				t("message.projectUpdated", { framework: "React" }).toString()
			);
			fetchData(currentPage);
		}
	};

	const departmentNodeCheckHandler = (ids: any) => {
		// setSelectedDepartment
		setDepartmentIds(ids);
		setCurrentPage(1);
		// setSelectedDepartment(id);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
		fetchData(currentpage);
	};

	const popupCloseHandler = () => {
		setIsPopupOpen(false);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		// let orderByParam = "";
		setToggleSort(!toggleSort);
		// if (toggleSort) {
		// 	orderByParam = `&OrderBy=${columnId}`;
		// } else {
		// 	orderByParam = `&OrderByDesc=${columnId}`;
		// }

		setOrderBy(columnId);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	const statusSelectHandler = (option: DropdownOption) => {
		setStatusId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		statuses: {
			options: statusOptions,
			onSelect: statusSelectHandler,
		},
	};

	return (
		<PageContainer
			title={t("page.phoneDirectoryHome", { framework: "React" })}
			className={styles.phoneDirectory}>
			<div className={styles.content}>
				<div>
					<ShadowedContainer
						className={
							language === "ar" ? styles.hierarchyLTR : styles.hierarchy
						}>
						<DepartmentTree
							onNodeCheck={departmentNodeCheckHandler}
							isExpanded
						/>
					</ShadowedContainer>
				</div>
				<div className={styles.table}>
					<PaginatedTable
						totalCountText={t("user.count", { framework: "React" })}
						totalCount={totalCount}
						pageSize={pageSize}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						data={employees}
						columns={columns}
						dropdowns={dropdowns}
						onSearch={userSearchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						// displayActionsColumn={privileges?.updatePrivilege!}
						noRecordText={t("table.noEmployee", { framework: "React" })}
						onActiveStatusOptionSelectionChange={() => {}}
						hideActiveStatusDropdown
						hideWorkflowStatusDropdown
						onWorkflowStatusOptionSelectionChange={() => {}}
					/>
				</div>
				<div></div>
				<Modal
					isOpen={isPopupOpen}
					onClose={popupCloseHandler}>
					<PhoneForm
						data={selectedRow}
						actionButtonText={t("button.update", { framework: "React" })}
						onSubmit={recordUpdateHandler}
					/>
				</Modal>
			</div>
		</PageContainer>
	);
};

export default PhoneDirectoryPage;
