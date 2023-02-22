import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	NotAuthorized,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { ProjectsListTable } from "./containers";

import { APIProject } from "../../../api/projects/types";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getProjectsList } from "../../../api/projects/get/getProjectsList";
import { getProjects } from "../../../api/projects/get/getProjects";
import { getProjectsByKeyword } from "../../../api/projects/get/getProjectsByKeyword";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";
import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";
import { Column } from "react-table";
import { ProjectColumns } from "../../../components/PaginatedTable/types";

const ProjectManagementPage = () => {
	const [t] = useTranslation("common");

	const role = useStore((state) => state.loggedInUser.role);
	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [projects, setProjects] = useState<APIProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);

	const [projectOptions, setProjectOptions] = useState<DropdownOption[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);

	const id = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const projectNameAr = t("project.nameArabic", { framework: "React" });
	const projectNameEng = t("project.nameEnglish", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });

	const columns: Column<ProjectColumns>[] = [
		{
			Header: id,
			accessor: (p) => p.id,
		},
		{
			Header: projectName,
			accessor: (p) => p.name,
		},
		{
			Header: projectNameAr,
			accessor: (p) => p.nameArabic,
		},
		{
			Header: projectNameEng,
			accessor: (p) => p.nameEnglish,
		},
		{
			Header: "Group",
			accessor: (p) => p.group?.nameArabic,
		},
		{
			Header: "Group [English]",
			accessor: (p) => p.group?.nameEnglish,
		},
		{
			Header: actions,
			accessor: (p) => p.id,
			Cell: ({ value }: any) => (
				<div className={styles.action}>
					<div className={styles.btnDiv}>
						<RedirectButton
							label={detail}
							redirectTo={`${RoutePath.PROJECT}/${value}`}
							style={{ height: "20px", fontSize: "12px" }}
						/>
					</div>
				</div>
			),
		},
	];

	const fetchProjects = useMemo(
		() => async (currentPage: number) => {
			if (keyword === "") {
				// Get all the projects if no keyword is mentioned
				const { data, error } = await getProjects(currentPage, pageSize);
				if (error) {
					if (error?.response!.status! === 403) {
						setCanView(false);
					}
				}

				if (data) {
					setProjects(data?.projects);
					setTotalCount(data?.totalItems);
					setPageSize(data?.pageSize);
				}
			} else {
				const { data } = await getProjectsByKeyword(
					keyword,
					currentPage,
					pageSize
				);

				if (data) {
					setProjects(data?.projects);
					setTotalCount(data?.totalItems);
					setPageSize(data?.pageSize);
				}
			}
		},
		[keyword, pageSize]
	);

	useEffect(() => {
		if (role === ROLE.USER) {
			setCanView(false);
			return;
		} else {
			fetchProjects(1);
			setCanView(true);
		}
	}, [fetchProjects, pageSize, role]);

	// // Getting list of all projects
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const { data } = await getProjectsList();

	// 		if (data) {
	// 			setProjectOptions(
	// 				data?.map((project) => {
	// 					return {
	// 						label: project.nameEnglish + "  -  " + project.name,
	// 						value: project.id,
	// 					};
	// 				})
	// 			);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	// // Getting list of all departments
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const { data } = await getDepartments();

	// 		if (data) {
	// 			setDepartmentOptions(
	// 				data?.map((dept) => {
	// 					return {
	// 						label: dept.nameEnglish + " - " + dept.name,
	// 						value: dept.id,
	// 					};
	// 				})
	// 			);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	const projectSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const pageChangeHandler = (currentPage: number) => {
		fetchProjects(currentPage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	return canView ? (
		<div className={styles.projectsList}>
			<ShadowedContainer className={styles.section}>
				<div className={styles.actions}>
					<div className={styles.btn}>
						<RedirectButton
							label={t("button.addNewProject", { framework: "React" })}
							redirectTo={`${RoutePath.PROJECT}/new`}
						/>
					</div>
				</div>
			</ShadowedContainer>

			<PaginatedTable
				totalCount={totalCount}
				pageSize={pageSize}
				data={projects}
				columns={columns}
				onSearch={projectSearchClickHandler}
				onTableSort={function (columneId: string, isSortedDesc: boolean): void {
					throw new Error("Function not implemented.");
				}}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noProject", { framework: "React" })}
			/>
		</div>
	) : (
		<NotAuthorized />
	);
};

export default ProjectManagementPage;
