import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Column } from "react-table";
import {
	Button,
	DeleteConfirmation,
	Pagination,
	RedirectButton,
	SearchBox,
	ShadowedContainer,
	Table,
	TotalCount,
} from "..";
import { getProjectUsers } from "../../api/projects/get/getProjectUsers";
import { useStore } from "../../utils/store";
import { APIUserTable } from "./types";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { deleteProject } from "../../api/users/delete/deleteProject";

interface Props {
	projectId: string;
	// users: APIUserTable[];
}

const AllocatedUsers: FC<Props> = ({ projectId }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [selectedProjectId, setSelectedProjectId] = useState("");

	const [keyword, setKeyword] = useState("");

	const [showModal, setShowModal] = useState(false);

	const [users, setUsers] = useState<APIUserTable[]>([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const pageSize = 10;

	const fetchData = useMemo(
		() => async (keyword: string) => {
			const { data } = await getProjectUsers(
				projectId!,
				keyword,
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
		[currentPage, language, projectId]
	);

	useEffect(() => {
		// const fetchData = async () => {
		// 	const { data } = await getProjectUsers(projectId!, currentPage, pageSize);

		// 	if (data) {
		// 		setUsers(
		// 			data?.users.map((p) => {
		// 				let name = '';
		// 				if (language !== 'ar') {
		// 					name = p.user.name;
		// 				} else {
		// 					name = p.user.nameEnglish || p.user.name;
		// 				}
		// 				return {
		// 					...p,
		// 					id: p.id,
		// 					userId: p.user.id,
		// 					userName: name,
		// 					privilege:
		// 						language !== 'ar'
		// 							? p.privilege?.name!
		// 							: p.privilege?.nameEnglish!,
		// 					department:
		// 						language !== 'ar'
		// 							? p.department.name
		// 							: p.department.nameEnglish,
		// 				};
		// 			})
		// 		);

		// 		setTotalCount(data?.totalItems);
		// 	}
		// };

		fetchData(keyword);
	}, [fetchData, keyword]);

	const employeeNumber = t("user.employeeNumber", { framework: "React" });
	const userName = t("user.name", { framework: "React" });
	const privilege = t("privilege.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const deleteBtn = t("button.delete", { framework: "React" });

	const columns: Column<APIUserTable>[] = [
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
		{
			Header: actions,
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<div className={language !== "ar" ? styles.action : styles.actionLTR}>
					<div className={styles.btnDiv}>
						<RedirectButton
							label={edit}
							redirectTo={`${RoutePath.PROJECT}/${projectId}/user/${value.id}/edit`}
							style={{ height: "20px", fontSize: "12px" }}
						/>
					</div>
					<div>
						<Button
							style={{ height: "20px", fontSize: "12px" }}
							onClick={() => deleteClickHandler(value.id)}
						>
							{deleteBtn}
						</Button>
					</div>
				</div>
			),
		},
	];

	const userSearchHandler = (keyword: string) => {
		setKeyword(keyword);
		fetchData(keyword);
	};

	const deleteClickHandler = (id: string) => {
		setSelectedProjectId(id);
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		if (selectedProjectId !== "") {
			const { data } = await deleteProject(selectedProjectId);

			if (data) {
				setUsers(users.filter((u) => u.id !== +selectedProjectId));
				toast.success(
					t("message.userProjectDeleted", { framework: "React" }).toString()
				);
			}
		}

		setShowModal(false);
	};

	const deleteProjectCancelHandler = () => {
		setShowModal(false);
	};

	const pageChangeHandler = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const newUserPath = RoutePath.PROJECT + "/" + projectId + "/user/assign";

	return (
		<>
			<div className={styles.detailBar}>
				<div
					className={
						language !== "ar" ? styles.detailSection : styles.detailSectionLTR
					}
				>
					<TotalCount
						label={t("user.count", { framework: "React" })}
						count={totalCount}
					/>
				</div>
				<div className={language !== "ar" ? styles.buttons : styles.buttonsLTR}>
					<ShadowedContainer className={styles.box}>
						<RedirectButton
							label={t("button.assignToUser", { framework: "React" })}
							redirectTo={newUserPath}
						/>
					</ShadowedContainer>
				</div>
			</div>
			<SearchBox onClick={userSearchHandler} label="Search User" />
			<Table data={users!} columns={columns} />
			<Pagination
				className={styles.paginationBar}
				currentPage={currentPage}
				totalCount={totalCount}
				pageSize={10}
				onPageChange={(page) => pageChangeHandler(page)}
			/>
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteProjectCancelHandler}
			/>
		</>
	);
};

export default AllocatedUsers;
