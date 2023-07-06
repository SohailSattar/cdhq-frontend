import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import { getUserProjects } from "../../api/userProjects/get/getUserProjects";
import { useStore } from "../../utils/store";
import Button from "../Button";
import Table from "../Table";
import { APIProjectTable } from "./types";
import { updateUserProjectStatus } from "../../api/userProjects/update/updateUserProjectStatus";

import styles from "./styles.module.scss";
import {
	ActiveStatus,
	DeleteConfirmation,
	Pagination,
	ProjectSummary,
	SearchBox,
	ShadowedContainer,
	StatusIcon,
	TotalCount,
} from "..";
import { deleteProject } from "../../api/users/delete/deleteProject";
import { toast } from "react-toastify";

interface Props {
	id: string;
	displayActionsColumn?: boolean;
	onEditButtonClick?: (id: string) => void;
	onDeleteButtonClick?: (id: string) => void;
}

const UserProjectTable: FC<Props> = ({
	id,
	displayActionsColumn = false,
	onEditButtonClick = () => {},
	onDeleteButtonClick = () => {},
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const [projects, setProjects] = useState<APIProjectTable[]>([]);

	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [keyword, setKeyword] = useState<string>("");

	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const pageSize = 50;

	const fetchProjects = useMemo(
		() => async (id: string) => {
			const { data } = await getUserProjects(
				id!,
				currentPage,
				pageSize,
				keyword
			);

			if (data) {
				setTotalCount(data?.totalItems);
				setProjects(
					data?.projects.map((p) => {
						return {
							...p,
							id: p.id,
							projectId: p.project.id,
							privilege:
								language !== "ar"
									? p.privilege?.name!
									: p.privilege?.nameEnglish!,
							projectName:
								language !== "ar" ? p.project!.name : p.project!.nameEnglish,
							isChildProject: p.project.parentId !== p.project.id,
							department:
								language !== "ar"
									? p.department.name
									: p.department.nameEnglish,
							details: {
								departmentChild: p.departmentChild,
								canGrant: p.canGrant!,
								status: p.activeStatus,
							},
							activeStatus:
								language !== "ar"
									? p.activeStatus.nameArabic
									: p.activeStatus.nameEnglish,
						};
					})
				);
			}
		},
		[id, keyword]
	);

	useEffect(() => {
		// const fetchData = async (id: string) => {
		// 	const { data } = await getUserProjects(id!, currentPage);

		// 	if (data) {
		// 		setTotalCount(data?.totalItems);
		// 		setProjects(
		// 			data?.projects.map((p) => {
		// 				return {
		// 					...p,
		// 					id: p.id,
		// 					projectId: p.project.id,
		// 					privilege:
		// 						language !== "ar"
		// 							? p.privilege?.name!
		// 							: p.privilege?.nameEnglish!,
		// 					projectName:
		// 						language !== "ar" ? p.project!.name : p.project!.nameEnglish,
		// 					isChildProject: p.project.parentId !== p.project.id,
		// 					department:
		// 						language !== "ar"
		// 							? p.department.name
		// 							: p.department.nameEnglish,
		// 					details: {
		// 						departmentChild: p.departmentChild,
		// 						canGrant: p.canGrant!,
		// 						status: p.activeStatus,
		// 					},
		// 					activeStatus:
		// 						language !== "ar"
		// 							? p.activeStatus.nameArabic
		// 							: p.activeStatus.nameEnglish,
		// 				};
		// 			})
		// 		);
		// 	}
		// };

		fetchProjects(id);
	}, [currentPage, id, keyword, language, pageSize]);

	const editClickHandler = (id: string) => {
		onEditButtonClick(id);
	};

	const deleteClickHandler = (id: string) => {
		setSelectedProjectId(id);
		setIsModalOpen(true);
		onDeleteButtonClick(id);
	};

	const projectId = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const privilege = t("privilege.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });
	const deptStructure = t("department.structureType", { framework: "React" });
	const canGrant = t("userProject.canGrant", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const deleteBtn = t("button.delete", { framework: "React" });

	const columns: Column<APIProjectTable>[] = [
		{ Header: projectId, accessor: (p) => p.projectId! },
		{
			Header: projectName,
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<div
					className={
						value.isChildProject
							? language !== "ar"
								? styles.childProject
								: styles.childProjectLTR
							: ""
					}>
					{value.projectName}
				</div>
			),
		},
		{
			Header: privilege,
			accessor: (p) => p.privilege,
		},
		{
			Header: department,
			accessor: (p) => p.department,
		},
		{
			Header: deptStructure,
			accessor: (p) => p.details.departmentChild,
			Cell: ({ value }: any) => (
				<div>
					{value === 9
						? t("department.withChild", { framework: "React" })
						: t("department.single", { framework: "React" })}
				</div>
			),
		},
		{
			Header: canGrant,
			accessor: (p) => p.details.canGrant,
			Cell: ({ value }: any) => (
				<div className={styles.cell}>
					<StatusIcon status={value} />
				</div>
			),
		},
		{
			Header: status,
			accessor: (p) => p.activeStatus,
		},
		{
			Header: <div className={styles.tableHeaderCell}>{actions}</div>,
			id: "actions",
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<div className={language !== "ar" ? styles.action : styles.actionLTR}>
					<div className={styles.btnDiv}>
						<Button onClick={(id) => editClickHandler(value.id)}>{edit}</Button>
					</div>
					<div>
						<Button onClick={(id) => deleteClickHandler(value.id)}>
							{deleteBtn}
						</Button>
					</div>
				</div>
			),
		},
	];

	const searchClickHandler = (value: string) => {
		// const {data} =
		setKeyword(value);
	};

	const deleteConfirmationClickHandler = async () => {
		if (selectedProjectId !== "") {
			const { data, error } = await deleteProject(selectedProjectId);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				setProjects(projects.filter((p) => p.id !== +selectedProjectId));
				toast.success("Deleted successfully");
			}
		}

		setSelectedProjectId("");
		setIsModalOpen(false);
	};

	const deleteProjectCancelHandler = () => {
		setSelectedProjectId("");
		setIsModalOpen(false);
	};

	const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	return (
		<>
			<SearchBox onClick={searchClickHandler} />
			<TotalCount
				label={t("project.count", { framework: "React" })}
				count={totalCount}
			/>
			<Table
				data={projects!}
				columns={columns}
				columnsToHide={displayActionsColumn ? [] : [actions]}
				noRecordsText={t("table.noProject", { framework: "React" })}
			/>
			<Pagination
				className={styles.paginationBar}
				currentPage={currentPage}
				totalCount={totalCount}
				pageSize={pageSize}
				onPageChange={(page) => pageChangeHandler(page)}
			/>

			<DeleteConfirmation
				isOpen={isModalOpen}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteProjectCancelHandler}
			/>
		</>
	);
};

export default UserProjectTable;
