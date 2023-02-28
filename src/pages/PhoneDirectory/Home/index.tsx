import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { toast } from "react-toastify";
import { APIPrivileges } from "../../../api/privileges/type";
import {
	Button,
	DepartmentTree,
	Modal,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import PhoneForm from "../../../components/Form/PhoneForm";
import { IPhoneFormInputs } from "../../../components/Form/types";
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

	const [currentPage, setCurrentPage] = useState(1);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState<APIPhoneDirectory>();

	const id = t("user.id", { framework: "React" });
	// const employeeNo = t("user.employeeNumber", { framework: "React" });
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
						{language !== "ar" ? value?.fullName! : value?.nameEnglish!}
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
							className={language !== "ar" ? styles.btnDiv : styles.btnDivLTR}
						>
							{privileges?.updatePrivilege! === true && (
								<Button
									onClick={() => {
										editClickHandler(row.values);
									}}
									style={{ height: "20px", fontSize: "12px" }}
								>
									{edit}
								</Button>
							)}
						</div>
					</div>
				),
			},
		],
		[
			actions,
			edit,
			fullName,
			phone,
			phoneOffice,
			id,
			language,
			rank,
			privileges,
		] //role
	);

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const fetchData = useMemo(
		() => async (currentPage: number) => {
			// Check Privilege
			const { data: privilege } = await getProjectPrivilege(
				Project.PhoneDirectory
			);

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
				if (selectedDepartment) {
					const { data } = await getPhoneDirectoryByDepartment(
						selectedDepartment,
						currentPage,
						pageSize
					);

					if (data) {
						setEmployees(data?.employees!);
						setTotalCount(data?.totalItems!);
					}
				} else {
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
			}
		},
		[selectedDepartment, pageSize, keyword]
	);

	useEffect(() => {
		fetchData(currentPage);
	}, [fetchData, currentPage]);

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

	const departmentNodeCheckHandler = (id: any) => {
		// setSelectedDepartment
		setSelectedDepartment(id);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentPage);
		fetchData(currentpage);
	};

	const popupCloseHandler = () => {
		setIsPopupOpen(false);
	};

	return (
		<div className={styles.phoneDirectory}>
			<div className={styles.content}>
				<div>
					<ShadowedContainer
						className={
							language === "ar" ? styles.hierarchyLTR : styles.hierarchy
						}
					>
						<DepartmentTree
							showCheckbox={false}
							onNodeCheck={departmentNodeCheckHandler}
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
						displayActionsColumn={privileges?.updatePrivilege!}
						noRecordText={t("table.noEmployee", { framework: "React" })}
					/>
				</div>
				<div></div>
				<Modal isOpen={isPopupOpen} onClose={popupCloseHandler}>
					<PhoneForm data={selectedRow} onSubmit={recordUpdateHandler} />
				</Modal>
			</div>
		</div>
	);
};

export default PhoneDirectoryPage;
