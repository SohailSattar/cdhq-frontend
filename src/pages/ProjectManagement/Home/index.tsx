import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActiveStatus,
	PageContainer,
	PaginatedTable,
	RedirectButton,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";

import { APIProject } from "../../../api/projects/types";
import { getProjects } from "../../../api/projects/get/getProjects";

import { Id, ROLE } from "../../../utils";
import { useStore } from "../../../utils/store";
import { Column } from "react-table";
import { ProjectColumns } from "../../../components/PaginatedTable/types";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";

const ProjectManagementPage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const role = useStore((state) => state.loggedInUser.role);
	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [projects, setProjects] = useState<APIProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);

	const [toggleSort, setToggleSort] = useState(false);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);

	const id = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const projectNameEng = t("project.nameEnglish", { framework: "React" });
	const projectGroup = t("project.group", { framework: "React" });
	const projectGroupEnglish = t("project.groupEnglish", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	const [orderBy, setOrderBy] = useState<string>("");

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });

	const columns: Column<ProjectColumns>[] = [
		{
			Header: id,
			id: "id",
			accessor: (p) => p.id,
		},
		{
			Header: projectName,
			id: "name",
			accessor: (p) => p.name,
		},
		{
			Header: projectNameEng,
			id: "nameEnglish",
			accessor: (p) => p.nameEnglish,
		},
		{
			Header: projectGroup,
			id: "projectGroupId",
			accessor: (p) => p.group?.nameArabic,
		},
		{
			Header: projectGroupEnglish,
			accessor: (p) => p.group?.nameEnglish,
		},
		{
			Header: status,
			id: "activeStatus",
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<ActiveStatus
					code={value.activeStatus?.id!}
					text={
						language !== "ar"
							? value.activeStatus.nameArabic
							: value.activeStatus.nameEnglish
					}
				/>
			),
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
		() => async () => {
			// if (keyword === "") {
			// 	// Get all the projects if no keyword is mentioned
			// 	const { data, error } = await getProjects(
			// 		currentPage,
			// 		pageSize,
			// 		keyword,
			// 		selectedStatusCode
			// 	);
			// 	if (error) {
			// 		if (error?.response!.status! === 403) {
			// 			setCanView(false);
			// 		}
			// 	}

			// 	if (data) {
			// 		setProjects(data?.projects);
			// 		setTotalCount(data?.totalItems);
			// 		setPageSize(data?.pageSize);
			// 	}
			// } else {
			// 	const { data } = await getProjectsByKeyword(
			// 		keyword,
			// 		currentPage,
			// 		pageSize
			// 	);

			// 	if (data) {
			// 		setProjects(data?.projects);
			// 		setTotalCount(data?.totalItems);
			// 		setPageSize(data?.pageSize);
			// 	}
			// }
			const { data, error } = await getProjects(
				currentPage,
				pageSize,
				keyword,
				selectedStatusCode,
				orderBy
			);
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
		},
		[keyword, currentPage, pageSize, selectedStatusCode, orderBy]
	);

	useEffect(() => {
		if (role === ROLE.USER || role === "") {
			setCanView(false);
			return;
		} else {
			fetchProjects();
			setCanView(true);
		}
	}, [fetchProjects, currentPage, pageSize, role]);

	const projectSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const pageChangeHandler = (currentPage: number) => {
		// fetchProjects();
		setCurrentPage(currentPage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;
		setPageSize(size);
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
		setCurrentPage(1);
		// fetchProjects(currentPage, orderByParam);
	};

	const statusSelectHandler = (option: DropdownOption) => {
		if (option) {
			setSelectedStatusCode(option?.value!);
		} else {
			setSelectedStatusCode("");
		}
	};

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			title={t("page.projectHome", { framework: "React" })}
			showAddButton={role === ROLE.SUPERADMIN}
			btnAddLabel={t("button.addNewProject", { framework: "React" })}
			btnAddUrlLink={RoutePath.PROJECT_NEW}
			className={styles.projectsList}>
			<PaginatedTable
				totalCountText={t("project.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={projects}
				columns={columns}
				onSearch={projectSearchClickHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				hideWorkflowStatusDropdown
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noProject", { framework: "React" })}
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				onWorkflowStatusOptionSelectionChange={() => {}}
			/>
		</PageContainer>
	);
};

export default ProjectManagementPage;
