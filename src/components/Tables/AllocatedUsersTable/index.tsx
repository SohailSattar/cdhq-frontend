import { useTranslation } from "react-i18next";
import { PaginatedTable } from "../..";
import { useStore } from "../../../utils/store";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";
import { Id } from "../../../utils";
import { Column } from "react-table";
import { getProjectUsers } from "../../../api/projects/get/getProjectUsers";
import { APIProjectUserTable } from "../../PaginatedTable/types";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { APIExportData } from "../../../api";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import { APIExportAllocatedUser } from "../../../api/projects/types";
import { exportAllocatedUsers } from "../../../api/projects/export/exportAllocatedUsers";
import { toast } from "react-toastify";

interface Props {
	projectId: Id;
}

const AllocatedUsersTable: FC<Props> = ({ projectId }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [parentOptions, setParentOptions] = useState<DropdownOption[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);
	const [linkTypeOptions, setLinkTypeOptions] = useState<DropdownOption[]>([]);

	const [users, setUsers] = useState<APIProjectUserTable[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [departmentId, setDepartmentId] = useState<Id>("");

	const [statusCode, setStatusCode] = useState<Id>("");

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	const employeeNumber = t("user.employeeNumber", { framework: "React" });
	const userName = t("user.name", { framework: "React" });
	const privilege = t("privilege.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	const columns: Column<APIProjectUserTable>[] = [
		{
			Header: employeeNumber,
			accessor: (p) => p.userId,
		},
		{
			Header: userName,
			accessor: (p) => p.userName,
		},
		{
			Header: privilege,
			accessor: (p) => p.privilege,
		},
		{
			Header: department,
			accessor: (p) => p.department,
		},
	];

	const fetchDepartments = useCallback(async () => {
		const { data } = await getDepartmentsByProject(projectId);
		if (data) {
			setDepartmentOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language, projectId]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	const fetchData = useMemo(
		() => async (keyword: string) => {
			const { data } = await getProjectUsers(
				projectId!,
				keyword,
				departmentId,
				currentPage,
				pageSize
			);

			if (data) {
				setUsers(
					data?.users.map((p) => {
						let name = "";
						if (language !== "ar") {
							name = p.user.name;
						} else {
							name = p.user.nameEnglish || p.user.name;
						}
						return {
							...p,
							id: p.id,
							userId: +p.user.employeeNo,
							userName: name,
							privilege:
								language !== "ar"
									? p.privilege?.name!
									: p.privilege?.nameEnglish!,
							department:
								language !== "ar"
									? p.department.name
									: p.department.nameEnglish,
						};
					})
				);

				setTotalCount(data?.totalItems);
			}
		},
		[currentPage, departmentId, language, pageSize, projectId]
	);

	useEffect(() => {
		fetchData(keyword);
	}, [fetchData, keyword]);

	const userSearchHandler = (keyword: string) => {
		setKeyword(keyword);
		fetchData(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		let orderByParam = "";
		setToggleSort(!toggleSort);
		if (toggleSort) {
			orderByParam = `&OrderBy=${columnId}`;
		} else {
			orderByParam = `&OrderByDesc=${columnId}`;
		}
		setOrderBy(orderByParam);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const activeStatusSelectHandler = (option: DropdownOption) => {
		setStatusCode(option?.value);
	};

	const departmentSelectHandler = (option: DropdownOption) => {
		setDepartmentId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		department: {
			options: departmentOptions,
			onSelect: departmentSelectHandler,
		},
	};

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportAllocatedUser,
		Record<string, string>
	> = {
		// id: { value: "Id", text: id },
		employeeNo: { value: "User.EmployeeNo", text: employeeNumber },
		name: { value: "User", text: userName },
		privilege: { value: "Privilege", text: privilege },
		department: { value: "Department", text: department },
	};

	const exportDataHandler = async (data: APIExportData) => {
		setIsExportLoading(true);
		const dataValues: APIExportData = {
			...data,
			language: language === "ar" ? "en" : "ar",
			queryParams: {
				postsPerPage: pageSize,
				keyword: keyword,
				orderBy: orderBy,
				isDescending: toggleSort,
			},
		};

		// saving to the file
		const priv = t("privilege.name", { framework: "React" });
		const currentDate = format(new Date(), "ddMMyyyyhhmmss", {
			locale: language !== "ar" ? ar : enGB,
		});
		const fileName = `${projectId}_${priv}_${currentDate}.${data.format}`;

		const { data: fData, error } = await exportAllocatedUsers(
			projectId,
			dataValues,
			fileName
		);
		if (fData) {
			toast.success(t("message.downloaded", { framework: "React" }).toString());
		}
		if (error) {
			toast.error(
				t("message.unauthorizedExport", { framework: "React" }).toString()
			);
		}
		setIsExportLoading(false);
	};

	return (
		<>
			<PaginatedTable
				totalCountText={t("user.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={users}
				columns={columns}
				noRecordText={t("table.noUser", { framework: "React" })}
				dropdowns={dropdowns}
				onSearch={userSearchHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				hideWorkflowStatusDropdown={true}
				onActiveStatusOptionSelectionChange={activeStatusSelectHandler}
				displayExportButton={true}
				displayPdfExportButton={false}
				exportDisplayNames={propertyDisplayNames}
				onExcelExport={exportDataHandler}
				// hideActiveStatusDropdown
			/>
		</>
	);
};

export default AllocatedUsersTable;
