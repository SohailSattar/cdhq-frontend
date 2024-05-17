import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { getUserProjects } from "../../api/userProjects/get/getUserProjects";
import { useStore } from "../../utils/store";
import Button from "../Button";
import { APIProjectTable } from "./types";
import { updateUserProjectStatus } from "../../api/userProjects/update/updateUserProjectStatus";

import styles from "./styles.module.scss";
import {
	ActiveStatus,
	DeleteConfirmation,
	PaginatedTable,
	StatusIcon,
} from "..";
import { deleteProject } from "../../api/users/delete/deleteProject";
import { toast } from "react-toastify";
import { APIProjectStatus } from "../../api/userProjects/types";
import { DropdownOption } from "../Dropdown";
import { Id } from "../../utils";

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
	const [pageSize, setPageSize] = useState<number>(50);

	const [statusCode, setStatusCode] = useState<Id>(1);

	const [orderBy, setOrderBy] = useState<string>("id");

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	// const pageSize = 50;

	const fetchProjects = useMemo(
		() => async (id: string) => {
			setIsLoadingData(true);
			const { data } = await getUserProjects(
				id!,
				currentPage,
				pageSize,
				keyword,
				statusCode,
				orderBy
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
								departmentStructureType: p.departmentStructureType,
								canGrant: p.canGrant!,
								status: p.activeStatus,
							},
							activeStatus: p.activeStatus,
						};
					})
				);
			}
			setIsLoadingData(false);
		},
		[currentPage, keyword, language, orderBy, pageSize, statusCode]
	);

	useEffect(() => {
		if (id) {
			fetchProjects(id);
		}
	}, [currentPage, fetchProjects, id, keyword, language, pageSize]);

	const editClickHandler = useCallback(
		(id: string) => {
			onEditButtonClick(id);
		},
		[onEditButtonClick]
	);

	const deleteClickHandler = useCallback(
		(id: string) => {
			setSelectedProjectId(id);
			setIsModalOpen(true);
			onDeleteButtonClick(id);
		},
		[onDeleteButtonClick]
	);

	const projectId = t("project.id", { framework: "React" });
	const projectName = t("project.name", { framework: "React" });
	const privilege = t("privilege.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });
	const deptStructure = t("department.structureType", { framework: "React" });
	const canGrant = t("userProject.canGrant", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	const actions = t("global.actions", { framework: "React" });
	const activate = t("button.activate", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const deleteBtn = t("button.deactivate", { framework: "React" });

	const activateClickHandler = useCallback(
		async (upId: string) => {
			const params: APIProjectStatus = {
				id: upId,
				statusId: 1,
			};
			setIsLoadingData(true);

			const { data, error } = await updateUserProjectStatus(params);

			if (data) {
				fetchProjects(id);
				toast.success(
					t("message.userProjectActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
			setIsLoadingData(false);
		},
		[fetchProjects, id, t]
	);

	const columnHelper = createColumnHelper<APIProjectTable>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row, {
				id: "projectId",
				header: projectName,
				cell: (info) => (
					<div
						className={
							info.getValue().isChildProject
								? language !== "ar"
									? styles.childProject
									: styles.childProjectLTR
								: ""
						}>
						{info.getValue().projectName}
					</div>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.privilege, {
				id: "privilegeId",
				header: privilege,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.department, {
				id: "departmentId",
				header: department,
				enableColumnFilter: false,
			}),

			columnHelper.accessor((row) => row.details.departmentStructureType, {
				id: "deptStructure",
				header: deptStructure,
				cell: (info) => (
					<div>
						{info.getValue() === 9
							? t("project.withChild", { framework: "React" })
							: t("project.withoutChild", { framework: "React" })}
					</div>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.details.canGrant, {
				id: "canGrant",
				header: canGrant,
				cell: (info) => (
					<div className={styles.cell}>
						<StatusIcon status={info.getValue()} />
					</div>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.activeStatus, {
				id: "activeStatusId",
				header: status,
				cell: (info) => (
					<ActiveStatus
						code={info.getValue().id === 1 ? 1 : 9}
						text={
							language !== "ar"
								? info.getValue().nameArabic
								: info.getValue().nameEnglish
						}
					/>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row, {
				id: "actions",
				header: () => <div className={styles.tableHeaderCell}>{actions}</div>,
				cell: (info) => (
					<div className={language !== "ar" ? styles.action : styles.actionLTR}>
						<div className={styles.btnDiv}>
							<Button
								onClick={(id) =>
									editClickHandler(info.getValue().id.toString())
								}>
								{edit}
							</Button>
						</div>
						{info.getValue().activeStatus.id !== 1 ? (
							<div className={styles.btnDiv}>
								<Button
									onClick={(id) =>
										activateClickHandler(info.getValue().id.toString())
									}>
									{activate}
								</Button>
							</div>
						) : (
							<div>
								<Button
									isCritical
									onClick={(id) =>
										deleteClickHandler(info.getValue().id.toString())
									}>
									{deleteBtn}
								</Button>
							</div>
						)}
					</div>
				),
				enableColumnFilter: false,
			}),

			// 	{
			// 		Header: <div className={styles.tableHeaderCell}>{actions}</div>,
			// 		id: "Actions",
			// 		accessor: (p) => p,
			// 		Cell: ({ value }: any) => (
			// 			<div className={language !== "ar" ? styles.action : styles.actionLTR}>
			// 				<div className={styles.btnDiv}>
			// 					<Button onClick={(id) => editClickHandler(value.id)}>{edit}</Button>
			// 				</div>
			// 				{value.activeStatus !== 1 ? (
			// 					<div className={styles.btnDiv}>
			// 						<Button onClick={(id) => activateClickHandler(value.id)}>
			// 							{activate}
			// 						</Button>
			// 					</div>
			// 				) : (
			// 					<div>
			// 						<Button
			// 							isCritical
			// 							onClick={(id) => deleteClickHandler(value.id)}>
			// 							{deleteBtn}
			// 						</Button>
			// 					</div>
			// 				)}
			// 			</div>
			// 		),
			// 	},
		],
		[
			actions,
			activate,
			activateClickHandler,
			canGrant,
			columnHelper,
			deleteBtn,
			deleteClickHandler,
			department,
			deptStructure,
			edit,
			editClickHandler,
			language,
			privilege,
			projectName,
			status,
			t,
		]
	);

	// const columns: Column<APIProjectTable>[] = [
	// 	{ Header: projectId, accessor: (p) => p.projectId! },
	// 	{
	// 		Header: projectName,
	// 		accessor: (p) => p,
	// 		Cell: ({ value }: any) => (
	// 			<div
	// 				className={
	// 					value.isChildProject
	// 						? language !== "ar"
	// 							? styles.childProject
	// 							: styles.childProjectLTR
	// 						: ""
	// 				}>
	// 				{value.projectName}
	// 			</div>
	// 		),
	// 	},
	// 	{
	// 		Header: privilege,
	// 		accessor: (p) => p.privilege,
	// 	},
	// 	{
	// 		Header: department,
	// 		accessor: (p) => p.department,
	// 	},
	// 	{
	// 		Header: deptStructure,
	// 		accessor: (p) => p.details.departmentStructureType,
	// 		Cell: ({ value }: any) => (
	// 			<div>
	// 				{value === 9
	// 					? t("project.withChild", { framework: "React" })
	// 					: t("project.withoutChild", { framework: "React" })}
	// 			</div>
	// 		),
	// 	},
	// 	{
	// 		Header: canGrant,
	// 		accessor: (p) => p.details.canGrant,
	// 		Cell: ({ value }: any) => (
	// 			<div className={styles.cell}>
	// 				<StatusIcon status={value} />
	// 			</div>
	// 		),
	// 	},
	// 	{
	// 		Header: status,
	// 		accessor: (p) => p.activeStatus,
	// 		Cell: ({ value }: any) => (
	// 			<ActiveStatus
	// 				code={value === 1 ? 1 : 9}
	// 				text={language !== "ar" ? value.nameArabic : value.nameEnglish}
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		Header: <div className={styles.tableHeaderCell}>{actions}</div>,
	// 		id: "Actions",
	// 		accessor: (p) => p,
	// 		Cell: ({ value }: any) => (
	// 			<div className={language !== "ar" ? styles.action : styles.actionLTR}>
	// 				<div className={styles.btnDiv}>
	// 					<Button onClick={(id) => editClickHandler(value.id)}>{edit}</Button>
	// 				</div>
	// 				{value.activeStatus !== 1 ? (
	// 					<div className={styles.btnDiv}>
	// 						<Button onClick={(id) => activateClickHandler(value.id)}>
	// 							{activate}
	// 						</Button>
	// 					</div>
	// 				) : (
	// 					<div>
	// 						<Button
	// 							isCritical
	// 							onClick={(id) => deleteClickHandler(value.id)}>
	// 							{deleteBtn}
	// 						</Button>
	// 					</div>
	// 				)}
	// 			</div>
	// 		),
	// 	},
	// ];

	const searchClickHandler = (value: string) => {
		// const {data} =
		setKeyword(value);

		if (value) {
			// if (status === "") {
			setStatusCode("");
			// }
		} else {
			setStatusCode(1);
		}
	};

	const deleteConfirmationClickHandler = async () => {
		if (selectedProjectId !== "") {
			const { data, error } = await deleteProject(selectedProjectId);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				// projects.find((x) => x.id === +selectedProjectId)?.activeStatus;

				// setProjects(projects.filter((p) => p.id !== +selectedProjectId));
				fetchProjects(id);
				toast.success(
					t("message.userProjectDeleted", { framework: "React" }).toString()
				);
			}
		}

		setSelectedProjectId("");
		setIsModalOpen(false);
	};

	const deleteProjectCancelHandler = () => {
		setSelectedProjectId("");
		setIsModalOpen(false);
	};

	const statusChangeHandler = (option: DropdownOption) => {
		if (option) {
			setStatusCode(+option.value);
		} else {
			setStatusCode("");
		}
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	// const departmenSelectHandler = (option: DropdownOption) => {
	// 	setTypeId(option?.value);
	// };

	// const dropdowns: { [key: string]: DropdownProps } = {
	// 	typeDropdown: {
	// 		options: typeOptions,
	// 		onSelect: departmenSelectHandler,
	// 	},
	// 	// linkTypeDropdown: {
	// 	// 	options: linkTypeOptions,
	// 	// 	onSelect: () => {},
	// 	// },
	// };

	return (
		<>
			<PaginatedTable
				totalCountText={t("project.count", { framework: "React" })}
				totalCount={totalCount}
				pageSize={pageSize}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				data={projects}
				columns={columns}
				noRecordText={t("table.noProject", { framework: "React" })}
				onSearch={searchClickHandler}
				onTableSort={() => {}}
				onPageChange={(page) => pageChangeHandler(page)}
				onPageViewSelectionChange={pageViewSelectionHandler}
				onActiveStatusOptionSelectionChange={statusChangeHandler}
				hideWorkflowStatusDropdown={true}
				isLoading={loadingData}
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
