import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { toast } from "react-toastify";
import { APIPrivileges } from "../../../api/privileges/type";
import {
	Button,
	DepartmentTree,
	Modal,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
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

const PhoneDirectoryPage = () => {
	const language = useStore((state) => state.language);
	const [t] = useTranslation("common");

	const [selectedDepartment, setSelectedDepartment] = useState();

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [employees, setEmployees] = useState<APIPhoneDirectory[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);

	const [keyword, setKeyword] = useState("");
	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	const [currentPage, setCurrentPage] = useState(1);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<APIPhoneDirectory>();

	const id = t("user.id", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const fullName = t("user.name", { framework: "React" });
	const phone = t("user.phone", { framework: "React" });
	const phoneOffice = t("user.phoneOffice", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const columns: Column<PhoneDirectoryColumns>[] = useMemo(
		() => [
			{
				Header: id,
				id: "id",
				accessor: (p) => p.id,
				Cell: ({ value }: any) => <div className={styles.name}>{value}</div>,
			},
			{
				Header: employeeNo,
				id: "employeeNo",
				accessor: (p) => p.employeeNo,
				Cell: ({ value }: any) => <div className={styles.name}>{value}</div>,
			},
			{
				Header: rank,
				id: "rank",
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
			id,
			employeeNo,
			rank,
			fullName,
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
					keyword
				);

				if (data) {
					setEmployees(data?.employees!);
					setTotalCount(data?.totalItems!);
				}
			}
		},
		[pageSize, keyword]
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
					departmentIds
				);

				if (data) {
					setEmployees(data?.employees!);
					setTotalCount(data?.totalItems!);
				}
			}
		},
		[currentPage, pageSize, keyword, departmentIds]
	);

	useEffect(() => {
		if (departmentIds.length === 0) {
			fetchData(currentPage);
		} else {
			fetchByDepartment();
		}
	}, [fetchData, currentPage, departmentIds.length, fetchByDepartment]);

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
		setCurrentPage(currentPage);
		fetchData(currentpage);
	};

	const popupCloseHandler = () => {
		setIsPopupOpen(false);
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
						data={employees}
						columns={columns}
						onSearch={userSearchClickHandler}
						onTableSort={() => {}}
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
