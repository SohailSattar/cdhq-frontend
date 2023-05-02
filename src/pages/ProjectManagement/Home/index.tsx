import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActiveStatus,
	NotAuthorized,
	PageContainer,
	PaginatedTable,
	RedirectButton,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";

import { APIProject } from "../../../api/projects/types";
import { getProjects } from "../../../api/projects/get/getProjects";
import { getProjectsByKeyword } from "../../../api/projects/get/getProjectsByKeyword";

import { ROLE } from "../../../utils";
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
	const [pageSize, setPageSize] = useState<number>(10);

	const id = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const projectNameAr = t("project.nameArabic", { framework: "React" });
	const projectNameEng = t("project.nameEnglish", { framework: "React" });

	const status = t("global.status", { framework: "React" });

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
			Header: status,
			id: "activeStatus",
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<ActiveStatus
					code={value.activeStatus.id}
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
		<PageContainer
			title={t("page.projectHome", { framework: "React" })}
			showBackButton
			showAddButton={role === ROLE.SUPERADMIN}
			btnAddLabel={t("button.addNewProject", { framework: "React" })}
			btnAddUrlLink={RoutePath.PROJECT_NEW}
			className={styles.projectsList}>
			<PaginatedTable
				totalCountText={t("project.count", { framework: "React" })}
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
		</PageContainer>
	) : (
		<NotAuthorized />
	);
};

export default ProjectManagementPage;
