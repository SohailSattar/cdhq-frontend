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
import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { APIExportData } from "../../../api";
import { useStore } from "../../../utils/store";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import { Id, toast } from "react-toastify";

import styles from "./styles.module.scss";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { EmployeeColumns } from "../../../components/PaginatedTable/types";
import {
	DropdownOption,
	Props as DropdownProps,
} from "../../../components/Dropdown";
import { getPagedEmployees } from "../../../api/employees/get/getPagedEmployees";
import { exportEmployees } from "../../../api/employees/export/exportEmployees";
import { getEmployeesByDepartments } from "../../../api/employees/get/getEmployeesByDepartments";
import { APIRole } from "../../../api/roles/types";
import { getMyRole } from "../../../api/users/get/getMyRole";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { ROLE } from "../../../utils";
import { Project } from "../../../data/projects";
import { APIPrivileges } from "../../../api/privileges/type";
import { getRanks } from "../../../api/ranks/get/getRanks";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { getEmployeeStatuses } from "../../../api/employees/get/getEmployeeStatuses";
import { getClasses } from "../../../api/classes/get/getClasses";
import { getFilteredEmployees } from "../../../api/employees/get/getFilteredEmployees";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";

const EmployeeHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [role, setRole] = useState<APIRole>();

	const [items, setItems] = useState<APIEmployeeListItem[]>([]);

	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	const [statusCode, setStatusCode] = useState<Id>();

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("rankId");
	const [toggleSort, setToggleSort] = useState(false);

	const [departmentIds, setDepartmentIds] = useState<string[]>([]);

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [rankOptions, setRankOptions] = useState<DropdownOption[]>([]);
	const [empStatusOptions, setEmpStatusOptions] = useState<DropdownOption[]>(
		[]
	);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);
	const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
	const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMyRole();
			if (data) {
				setRole(data.role!);
			}
		};

		fetch();
	}, []);

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
			if (role?.name !== ROLE.SUPERADMIN) {
				const { data: privilege } = await getProjectPrivilege(
					Project.Employees
				);
				if (privilege) {
					const {
						readPrivilege,
						insertPrivilege,
						updatePrivilege,
						deletePrivilege,
						canExportPdf,
						canExportExcel,
					} = privilege;
					setPrivileges({
						readPrivilege,
						insertPrivilege,
						updatePrivilege,
						deletePrivilege,
						canExportPdf,
						canExportExcel,
					});
				}
			}
		};

		fetch();
	}, [role?.name, setPrivileges]);

	const fetch = useMemo(
		() => async () => {
			const { data } = await getFilteredEmployees(columnFilters, {
				page,
				postsPerPage: pageSize,
				statusCode: statusCode,
				keyword,
				orderBy,
				isDescending: toggleSort,
			});

			if (data) {
				setItems(data.employees);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		},
		[columnFilters, keyword, orderBy, page, pageSize, statusCode, toggleSort]
	);

	useEffect(() => {
		fetch();
	}, [fetch, keyword, orderBy, page, pageSize, toggleSort]);

	const fetchByDepartment = useMemo(
		() => async () => {
			const { data } = await getEmployeesByDepartments(
				page,
				pageSize,
				departmentIds,
				keyword,
				statusCode,
				orderBy
			);

			if (data) {
				setItems(data?.employees);
				setTotalCount(data?.totalItems);
			}
		},
		[page, pageSize, departmentIds, keyword, statusCode, orderBy]
	);

	useEffect(() => {
		if (departmentIds.length === 0) {
			fetch();
		} else {
			fetchByDepartment();
		}
	}, [departmentIds.length, fetch, fetchByDepartment]);

	const fetchRanks = useCallback(async () => {
		const { data } = await getRanks();
		if (data) {
			setRankOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchRanks();
	}, [fetchRanks]);

	const fetchEmpStatus = useCallback(async () => {
		const { data } = await getEmployeeStatuses();
		if (data) {
			setEmpStatusOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchEmpStatus();
	}, [fetchEmpStatus]);

	const fetchDepartment = useCallback(async () => {
		const { data } = await getDepartmentsByProject(Project.Employees);
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
	}, [language]);

	useEffect(() => {
		fetchDepartment();
	}, [fetchDepartment]);

	const fetchSections = useCallback(async () => {
		const { data } = await getCategorizedDepartments();
		if (data) {
			setSectionOptions(
				data?.map((x) => {
					return {
						label: `${x.id} - ${
							language !== "ar" ? x.fullName : x.fullNameEnglish
						}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchSections();
	}, [fetchSections]);

	const fetchClass = useCallback(async () => {
		const { data } = await getClasses();
		if (data) {
			setClassOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchClass();
	}, [fetchClass]);

	const id = t("user.id", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const employeeNo = t("employee.militaryNo", { framework: "React" });
	const name = t("global.name", { framework: "React" });
	const nameArabic = t("global.nameArabic", { framework: "React" });
	const nameEnglish = t("global.nameEnglish", { framework: "React" });
	const age = t("employee.age", { framework: "React" });
	const empStatus = t("employee.status", { framework: "React" });
	const workLocation = t("employee.workLocation", { framework: "React" });
	const lastUpdate = t("common.lastUpdate", { framework: "React" });
	const notes = t("employee.notes", { framework: "React" });
	const assignedJob = t("employee.assignedJob", { framework: "React" });
	const workMode = t("employee.workMode", { framework: "React" });
	const workGroup = t("employee.workGroup", { framework: "React" });
	const profession = t("employee.profession", { framework: "React" });
	const professionalTraining = t("employee.professionalTraining", {
		framework: "React",
	});
	const phone = t("user.phone", { framework: "React" });
	const phoneOffice = t("user.phoneOffice", { framework: "React" });
	const passportNo = t("employee.passportNo", { framework: "React" });
	const nationalService = t("employee.nationalService", { framework: "React" });
	const militaryTrained = t("employee.militaryTrained", { framework: "React" });
	const militaryUniform = t("employee.militaryUniform", { framework: "React" });

	const qualification = t("employee.academicQualification", {
		framework: "React",
	});
	const degreeDate = t("employee.academicQualificationDate", {
		framework: "React",
	});
	const degreeName = t("employee.qualificationName", { framework: "React" });
	const degreeCountry = t("employee.qualificationCountry", {
		framework: "React",
	});
	const universityName = t("employee.universityName", { framework: "React" });

	const maritalStatus = t("employee.maritalStatus", { framework: "React" });
	const joinDate = t("employee.joinDate", { framework: "React" });
	const hireDate = t("employee.hireDate", { framework: "React" });
	const healthStatus = t("employee.healthStatus", { framework: "React" });
	const gender = t("employee.gender", { framework: "React" });
	const emergencyName = t("employee.emergency.phone2", { framework: "React" });
	const emergencyRelation = t("employee.emergency.relation", {
		framework: "React",
	});
	const emergencyPhone = t("employee.emergency.phone", { framework: "React" });
	const emergencyAddress = t("employee.emergency.address", {
		framework: "React",
	});
	const emirate = t("emirate.name", { framework: "React" });
	const emailNet = t("employee.emailNet", { framework: "React" });
	const eidNo = t("employee.eid", { framework: "React" });
	const districtName = t("employee.districtName", { framework: "React" });
	const nationality = t("employee.nationality", { framework: "React" });
	const contractType = t("employee.contractType", { framework: "React" });
	const bloodType = t("employee.bloodType", { framework: "React" });
	const birthPlace = t("employee.birthPlace", { framework: "React" });
	const birthDate = t("employee.dob", { framework: "React" });
	const milCardExpDate = t("employee.milCardExpDate", { framework: "React" });

	const department = t("department.name", { framework: "React" });
	const section = t("department.section", { framework: "React" });
	const recruiter = t("class.name", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	const position = t("employee.position", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const empCatOptions: DropdownOption[] = useMemo(
		() => [
			{
				label: t("status.active", {
					framework: "React",
				}),
				value: 1,
			},
			{
				label: t("status.expiringexpired", {
					framework: "React",
				}),
				value: 99,
			},
		],
		[t]
	);

	const columnHelper = createColumnHelper<EmployeeColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.employeeNo, {
				id: "employeeNo",
				cell: (info) => <div className={styles.name}>{info.getValue()}</div>,
				header: () => (
					<div className={styles.tableHeaderCell}>{employeeNo}</div>
				),
			}),
			columnHelper.accessor((row) => row.rank, {
				id: "rankId",
				header: rank,
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				meta: {
					filterVariant: "select",
					options: rankOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "name",
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{info.getValue().name}</div>
						<div className={styles.english}>{info.getValue().nameEnglish}</div>
					</div>
				),
				header: () => name,
			}),
			columnHelper.accessor((row) => row.status, {
				id: "statusId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => status,
				meta: {
					filterVariant: "select",
					options: empStatusOptions,
				},
			}),
			columnHelper.accessor((row) => row.department, {
				id: "departmentId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => (
					<div className={styles.tableHeaderCell}>{department}</div>
				),
				meta: {
					filterVariant: "select",
					options: departmentOptions,
				},
			}),
			columnHelper.accessor((row) => row.section, {
				id: "sectionId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => <div className={styles.tableHeaderCell}>{section}</div>,
				meta: {
					filterVariant: "select",
					options: sectionOptions,
				},
			}),
			columnHelper.accessor((row) => row.class, {
				id: "classId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => <div className={styles.tableHeaderCell}>{recruiter}</div>,
				meta: {
					filterVariant: "select",
					options: classOptions,
				},
			}),
			columnHelper.accessor((row) => row.militaryCardExpiryDate, {
				id: "militaryCardExpiryDate",
				cell: (info) => (
					<>
						{format(new Date(info.getValue()!), "dd MMMM yyyy", {
							locale: language !== "ar" ? ar : enGB,
						})}
					</>
				),
				header: () => milCardExpDate,
				enableColumnFilter: false,
			}),

			columnHelper.accessor((row) => row.id, {
				id: "id",
				cell: (info) => (
					<div className={styles.action}>
						<div className={styles.btnDiv}>
							<RedirectButton
								label={edit}
								redirectTo={`${RoutePath.EMPLOYEE_EDIT.replace(
									RoutePath.ID,
									info.getValue().toString()
								)}`}
								// style={{ height: "20px", fontSize: "12px" }}
							/>
						</div>
					</div>
				),
				header: () => actions,
				enableColumnFilter: false,
			}),
		],
		[
			actions,
			classOptions,
			columnHelper,
			department,
			departmentOptions,
			edit,
			empStatusOptions,
			employeeNo,
			language,
			milCardExpDate,
			name,
			rank,
			rankOptions,
			recruiter,
			section,
			sectionOptions,
			status,
		]
	);

	const searchClickHandler = (keyword: string) => {
		setKeyword(keyword);
		setPage(1);
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

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportEmployee,
		Record<string, string>
	> = {
		// id: { value: "Id", text: id },
		employeeNo: { value: "EmployeeNo", text: employeeNo },
		rank: { value: "Rank", text: rank },
		name: { value: "Name", text: nameArabic },
		nameEnglish: { value: "NameEnglish", text: nameEnglish },
		age: { value: "Age", text: age },
		status: { value: "Status", text: empStatus },
		department: { value: "Department", text: department },
		section: { value: "Section", text: workLocation },
		class: { value: "Class", text: recruiter },
		assignedJob: { value: "AssignedJob", text: assignedJob },
		workMode: { value: "WorkMode", text: workMode },
		workGroup: { value: "WorkGroup", text: workGroup },
		profession: { value: "Profession", text: profession },
		professionalTraining: {
			value: "ProfessionalTraining",
			text: professionalTraining,
		},
		phone: { value: "Phone", text: phone },
		phoneOffice: { value: "PhoneOffice", text: phoneOffice },
		passportNo: { value: "PassportNo", text: passportNo },
		nationalService: { value: "NationalService", text: nationalService },
		militaryTrain: { value: "MilitaryTrain", text: militaryTrained },
		militaryWear: { value: "MilitaryWear", text: militaryUniform },
		maritalStatus: { value: "MaritalStatus", text: maritalStatus },
		qualification: { value: "Qualification", text: qualification },
		degreeDate: { value: "DegreeDate", text: degreeDate },
		degreeName: { value: "DegreeName", text: degreeName },
		degreeCountry: { value: "DegreeCountry", text: degreeCountry },
		universityName: { value: "UniversityName", text: universityName },
		joinDate: { value: "JoinDate", text: joinDate },
		hireDate: { value: "HireDate", text: hireDate },
		healthStatus: { value: "HealthStatus", text: healthStatus },
		gender: { value: "Gender", text: gender },
		emergencyCallName: { value: "EmergencyCallName", text: emergencyName },
		emergencyCallRelation: {
			value: "EmergencyCallRelation",
			text: emergencyRelation,
		},
		emergencyCallPhone: { value: "EmergencyCallPhone", text: emergencyPhone },
		emergencyCallAddress: {
			value: "EmergencyCallAddress",
			text: emergencyAddress,
		},
		residenceEmirate: { value: "ResidenceEmirate", text: emirate },
		emailNet: { value: "EmailNet", text: emailNet },
		emiratesIdNo: { value: "EmiratesIdNo", text: eidNo },
		districtName: { value: "DistrictName", text: districtName },
		nationality: { value: "Nationality", text: nationality },
		contractType: { value: "ContractType", text: contractType },
		bloodType: { value: "BloodType", text: bloodType },
		birthPlace: { value: "BirthPlace", text: birthPlace },
		birthDate: { value: "BirthDate", text: birthDate },
		militaryCardExpiryDate: {
			value: "MilitaryCardExpiryDate",
			text: milCardExpDate,
		},
		notes: { value: "Notes", text: notes },
		updatedOn: { value: "UpdatedOn", text: lastUpdate },
		position: { value: "Position", text: position },
	};

	const exportDataHandler = async (data: APIExportData) => {
		setIsExportLoading(true);
		const dataValues: APIExportData = {
			...data,
			language: language === "ar" ? "en" : "ar",
			queryParams: {
				page: page,
				postsPerPage: pageSize,
				keyword: keyword,
				// projectId: selectedProject,
				// statusCode: selectedStatusCode,
				orderBy: orderBy,
				isDescending: toggleSort,
			},
			departmentIds: departmentIds,
			filters: columnFilters,
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

	const empCatSelectHandler = (option: DropdownOption) => {
		setStatusCode(option?.value);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		typeDropdown: {
			options: empCatOptions,
			onSelect: empCatSelectHandler,
		},
		// linkTypeDropdown: {
		// 	options: linkTypeOptions,
		// 	onSelect: () => {},
		// },
	};

	return (
		<PageContainer
			lockFor={[ROLE.USER]}
			displayContent={privileges?.readPrivilege!}
			title="Employees"
			showAddButton
			displayExportButton={role?.name! === ROLE.SUPERADMIN}
			btnAddUrlLink={RoutePath.EMPLOYEE_NEW}
			exportDisplayNames={propertyDisplayNames}
			onExcelExport={exportDataHandler}
			displayPdfExportButton={false}
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
						columns={columns}
						dropdowns={dropdowns}
						noRecordText={""}
						onSearch={searchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						hideActiveStatusDropdown
						onColumnFiltersChange={handleColumnFiltersChange}
						// classNameTable={styles.empTable}
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default EmployeeHomePage;
