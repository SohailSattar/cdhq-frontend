import { useTranslation } from "react-i18next";
import {
	APIEmployeeListItem,
	APIExportEmployee,
} from "../../../api/employees/types";
import {
	DepartmentTree,
	EmployeeTable,
	PageContainer,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";

import * as RoutePath from "../../../RouteConfig";
import { useEffect, useMemo, useState } from "react";
import { APIExportData } from "../../../api";
import { useStore } from "../../../utils/store";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";
import { Column } from "react-table";
import { EmployeeColumns } from "../../../components/PaginatedTable/types";
import { DropdownOption } from "../../../components/Dropdown";
import { getPagedEmployees } from "../../../api/employees/get/getPagedEmployees";
import { exportEmployees } from "../../../api/employees/export/exportEmployees";

const EmployeeHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APIEmployeeListItem[]>([]);

	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("rankId");
	const [toggleSort, setToggleSort] = useState(false);

	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getPagedEmployees({
				page,
				postsPerPage: pageSize,
				keyword,
				orderBy,
				isDescending: toggleSort,
			});
			if (data) {
				setItems(data.employees);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		};

		fetch();
	}, [keyword, orderBy, page, pageSize, toggleSort]);

	const id = t("user.id", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const employeeNo = t("user.employeeNumber", { framework: "React" });
	const name = t("global.name", { framework: "React" });
	const nameArabic = t("global.nameArabic", { framework: "React" });
	const nameEnglish = t("global.nameEnglish", { framework: "React" });
	const age = t("employee.age", { framework: "React" });

	const department = t("department.name", { framework: "React" });
	const section = t("department.section", { framework: "React" });
	const recruiter = t("class.name", { framework: "React" });

	const phone = t("user.phone", { framework: "React" });
	const email = t("user.email", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const columns: Column<EmployeeColumns>[] = useMemo(
		() => [
			// {
			// 	id: "img",
			// 	accessor: (p) => p.imageName,
			// 	Cell: ({ value }: any) => <PhotoThumbnailImage src={value!} />,
			// },
			// {
			// 	Header: txtId,
			// 	id: "id",
			// 	accessor: (p) => p.id,
			// },
			{
				Header: employeeNo,
				id: "employeeNo",
				accessor: (p) => p.employeeNo,
				Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			},
			{
				Header: rank,
				id: "rankId",
				accessor: (p) => p.rank,
				Cell: ({ value }: any) => (
					<div className={styles.rank}>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: name,
				id: "name",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{value.name}</div>
						<div className={styles.english}>{value.nameEnglish}</div>
					</div>
				),
			},
			{
				Header: status,
				id: "statusId",
				accessor: (p) => p.status,
				Cell: ({ value }: any) => (
					<div>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: department,
				id: "departmentId",
				accessor: (p) => p.department,
				Cell: ({ value }: any) => (
					<div>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: section,
				id: "sectionId",
				accessor: (p) => p.section,
				Cell: ({ value }: any) => (
					<div>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: recruiter,
				id: "classId",
				accessor: (p) => p.class,
				Cell: ({ value }: any) => (
					<div>
						{value
							? language !== "ar"
								? value?.name!
								: value?.nameEnglish!
							: "-"}
					</div>
				),
			},
			{
				Header: actions,
				accessor: (p) => p.id,
				Cell: ({ value }: any) => (
					<div className={styles.action}>
						<div className={styles.btnDiv}>
							<RedirectButton
								label={edit}
								redirectTo={`${RoutePath.EMPLOYEE_EDIT.replace(
									RoutePath.ID,
									value
								)}`}
								// style={{ height: "20px", fontSize: "12px" }}
							/>
						</div>
					</div>
				),
			},
		],
		[
			actions,
			department,
			edit,
			employeeNo,
			language,
			name,
			rank,
			recruiter,
			section,
			status,
		]
	);

	const searchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);
		setOrderBy(columnId);
		setPage(1);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const pageChangeHandler = (currentpage: number) => {
		setPage(currentpage);
	};

	const departmentNodeCheckHandler = (ids: any) => {
		setDepartmentIds(ids);
		setPage(1);
	};

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportEmployee,
		Record<string, string>
	> = {
		id: { value: "Id", text: id },
		employeeNo: { value: "EmployeeNo", text: employeeNo },
		rank: { value: "Rank", text: rank },
		nameEnglish: { value: "NameEnglish", text: nameEnglish },
		name: { value: "Name", text: nameArabic },
		department: { value: "Department", text: department },
		section: { value: "Section", text: section },
		class: { value: "Class", text: recruiter },
		status: { value: "Status", text: status },
		age: { value: "Age", text: age },
		phone: { value: "Phone", text: "phone" },

		professionalTraining: { value: "Phone", text: "phone" },
		workMode: { value: "Phone", text: "phone" },
		workGroup: { value: "Phone", text: "phone" },
		hireDate: { value: "Phone", text: "phone" },
		joinDate: { value: "Phone", text: "phone" },
		contractType: { value: "Phone", text: "phone" },
		profession: { value: "Phone", text: "phone" },
		nationality: { value: "Phone", text: "phone" },
		nationalService: { value: "Phone", text: "phone" },
		nationalServiceGroup: { value: "Phone", text: "phone" },
		statusDate: { value: "Phone", text: "phone" },
		militaryCardExpiryDate: { value: "Phone", text: "phone" },
		signList: { value: "Phone", text: "phone" },
		assignedJob: { value: "Phone", text: "phone" },
		additionalJob: { value: "Phone", text: "phone" },
		previousExperienceYear: { value: "Phone", text: "phone" },
		previousExperienceMonth: { value: "Phone", text: "phone" },
		previousExperienceDay: { value: "Phone", text: "phone" },
		militaryWear: { value: "Phone", text: "phone" },
		qualification: { value: "Phone", text: "phone" },
		degreeDate: { value: "Phone", text: "phone" },
		degreeName: { value: "Phone", text: "phone" },
		degreeCountry: { value: "Phone", text: "phone" },
		universityName: { value: "Phone", text: "phone" },
		residenceEmirate: { value: "Phone", text: "phone" },
		residenceCity: { value: "Phone", text: "phone" },
		residenceArea: { value: "Phone", text: "phone" },
		phone2: { value: "Phone", text: "phone" },
		phoneOffice: { value: "Phone", text: "phone" },
		emailLan: { value: "Phone", text: "phone" },
		emailNet: { value: "Phone", text: "phone" },
		gender: { value: "Phone", text: "phone" },
		maritalStatus: { value: "Phone", text: "phone" },
		religion: { value: "Phone", text: "phone" },
		birthDate: { value: "Phone", text: "phone" },
		birthPlace: { value: "Phone", text: "phone" },
		specialNeed: { value: "Phone", text: "phone" },
		healthStatus: { value: "Phone", text: "phone" },
		passportNo: { value: "Phone", text: "phone" },
		familyBookNo: { value: "Phone", text: "phone" },
		emiratesIdNo: { value: "Phone", text: "phone" },
		uidNo: { value: "Phone", text: "phone" },
		districtNo: { value: "Phone", text: "phone" },
		districtName: { value: "Phone", text: "phone" },
		lastMedicalTestDate: { value: "Phone", text: "phone" },
		bloodType: { value: "Phone", text: "phone" },
		weight: { value: "Phone", text: "phone" },
		actJobMOI: { value: "Phone", text: "phone" },
		statusDetail: { value: "Phone", text: "phone" },
		militaryTrain: { value: "Phone", text: "phone" },
	};

	const exportDataHandler = async (data: APIExportData) => {
		setIsExportLoading(true);
		const dataValues: APIExportData = {
			...data,
			language: language === "ar" ? "en" : "ar",
			queryParams: {
				// page: currentPage,
				postsPerPage: pageSize,
				keyword: keyword,
				// projectId: selectedProject,
				// statusCode: selectedStatusCode,
				orderBy: orderBy,
				isDescending: toggleSort,
			},
			departmentIds: departmentIds,
		};

		// saving to the file
		const emp = t("employee.names", { framework: "React" });
		const currentDate = format(new Date(), "ddMMyyyyhhmmss", {
			locale: language !== "ar" ? ar : enGB,
		});
		const fileName = `${emp}_${currentDate}.${data.format}`;

		const { data: fData, error } = await exportEmployees(dataValues, fileName);
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
		<PageContainer
			title="Employees"
			showAddButton
			displayExportButton
			btnAddUrlLink={RoutePath.EMPLOYEE_NEW}
			exportDisplayNames={propertyDisplayNames}
			onExcelExport={exportDataHandler}
			onPdfExport={exportDataHandler}
			isExportSelectionLoading={isExportLoading}>
			<div className={styles.content}>
				<div className={styles.hierarchyContainer}>
					<div
						className={
							language === "ar" ? styles.hierarchyLTR : styles.hierarchy
						}>
						<DepartmentTree
							onNodeCheck={departmentNodeCheckHandler}
							isExpanded
						/>
					</div>
				</div>
				<ShadowedContainer className={styles.table}>
					<PaginatedTable
						totalCountText={t("menu.count", { framework: "React" })}
						totalCount={totalCount}
						pageSize={pageSize}
						currentPage={page}
						data={items}
						columns={columns as Column<any>[]}
						noRecordText={""}
						onSearch={searchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						// classNameTable={styles.empTable}
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default EmployeeHomePage;
