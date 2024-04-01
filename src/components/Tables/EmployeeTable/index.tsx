import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../utils/store";
import { Column } from "react-table";
import { EmployeeColumns } from "../../PaginatedTable/types";
import { useEffect, useMemo, useState } from "react";

import {
	DepartmentTree,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
} from "../..";
import { DropdownOption } from "../../Dropdown";
import { getPagedEmployees } from "../../../api/employees/get/getPagedEmployees";
import {
	APIEmployeeListItem,
	APIExportEmployee,
} from "../../../api/employees/types";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { Project } from "../../../data/projects";

const EmployeeTable = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
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
				Header: age,
				id: "age",
				accessor: (p) => p.age,
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
			age,
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

	return (
		<div className={styles.content}>
			<ShadowedContainer className={styles.hierarchyContainer}>
				<div
					className={
						language === "ar" ? styles.hierarchyLTR : styles.hierarchy
					}>
					<DepartmentTree
						onNodeCheck={departmentNodeCheckHandler}
						isExpanded
					/>
				</div>
			</ShadowedContainer>
			<ShadowedContainer>
				<PaginatedTable
					totalCountText={t("menu.count", { framework: "React" })}
					totalCount={totalCount}
					pageSize={pageSize}
					currentPage={page}
					data={items}
					columns={columns}
					noRecordText={""}
					onSearch={searchClickHandler}
					onTableSort={tableSortHandler}
					onPageChange={pageChangeHandler}
					onPageViewSelectionChange={pageViewSelectionHandler}
					// classNameTable={styles.empTable}
				/>
			</ShadowedContainer>
		</div>
	);
};

export default EmployeeTable;
