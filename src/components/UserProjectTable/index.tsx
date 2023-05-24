import { FC, useEffect, useState } from "react";
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
	DeleteConfirmation,
	Pagination,
	ProjectSummary,
	ShadowedContainer,
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

	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const pageSize = 50;

	useEffect(() => {
		const fetchData = async (id: string) => {
			const { data } = await getUserProjects(id!, currentPage);

			if (data) {
				setTotalCount(data?.totalItems);
				setProjects(
					data?.projects.map((p) => {
						return {
							...p,
							id: p.id,
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
						};
					})
				);
			}
		};

		fetchData(id);
	}, [currentPage, id, language, pageSize]);

	const editClickHandler = (id: string) => {
		onEditButtonClick(id);
	};

	const deleteClickHandler = (id: string) => {
		setSelectedProjectId(id);
		setIsModalOpen(true);
		onDeleteButtonClick(id);
	};

	const projectName = t("project.name", { framework: "React" });
	const privilege = t("privilege.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	const actions = t("global.actions", { framework: "React" });
	const activate = t("button.activate", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const deleteBtn = t("button.delete", { framework: "React" });

	const columns: Column<APIProjectTable>[] = [
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
			Header: actions,
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<div className={language !== "ar" ? styles.action : styles.actionLTR}>
					<div className={styles.btnDiv}>
						<Button
							style={{ height: "20px", fontSize: "12px" }}
							onClick={(id) => editClickHandler(value.id)}>
							{edit}
						</Button>
					</div>
					<div>
						<Button
							style={{ height: "20px", fontSize: "12px" }}
							onClick={(id) => deleteClickHandler(value.id)}>
							{deleteBtn}
						</Button>
					</div>
				</div>
			),
		},
	];

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

	const projectStatusUpdateClickHandler = async (id: number) => {
		const { data } = await updateUserProjectStatus({
			id: id!.toString(),
		});

		if (data) {
		}
	};

	const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	return totalCount > 0 ? (
		<>
			<TotalCount
				label={t("project.count", { framework: "React" })}
				count={totalCount}
			/>
			<Table
				data={projects!}
				columns={columns}
				renderSubComponent={(row) => (
					<>
						<ProjectSummary
							id={row.id}
							readPrivilege={row.readPrivilege}
							insertPrivilege={row.insertPrivilege}
							updatePrivilege={row.updatePrivilege}
							deletePrivilege={row.deletePrivilege}
							canGrant={row.details.canGrant}
							departmentStructureType={row.details.departmentChild}
							department={row.department}
						/>
					</>
				)}
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
	) : (
		<ShadowedContainer className={styles.message}>
			{t("project.noProject", { framework: "React" })}
		</ShadowedContainer>
	);
};

export default UserProjectTable;
