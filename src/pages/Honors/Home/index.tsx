import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { getHonors } from "../../../api/honors/get/getHonors";
import { APIHonorDetail } from "../../../api/honors/types";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import {
	ActionButtons,
	PhotoThumbnailImage,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { HonorColumn } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";

const HonorsHomePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [honors, setHonors] = useState<APIHonorDetail[]>([]);

	const fetchData = useMemo(
		() => async (currentPage: number) => {
			const { data: privilege } = await getProjectPrivilege(Project.Honors);

			if (privilege) {
				const {
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivileges({
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});

				const { data } = await getHonors(currentPage, pageSize);

				if (data) {
					setHonors(data.honors);
					setTotalCount(data.totalItems);
				} else {
					// navigate(RoutePath.ROOT);
				}
			}
		},
		[pageSize]
	);

	useEffect(() => {
		fetchData(currentPage);
	}, [fetchData, currentPage, pageSize]);

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentPage);
		fetchData(currentpage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const editClickHandler = useMemo(
		() => (id: string) => {
			const editPath = RoutePath.HONORS_EDIT.replace(RoutePath.ID, id);
			navigate(editPath);
		},
		[navigate]
	);

	const txtId = t("honor.id", { framework: "React" });
	const honoredOn = t("honor.honoredOn", { framework: "React" });
	const name = t("honor.name", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });

	const columns: Column<HonorColumn>[] = useMemo(
		() => [
			{
				id: "img",
				accessor: (p) => p.imageName,
				Cell: ({ value }: any) => <PhotoThumbnailImage src={value!} />,
			},
			{
				Header: txtId,
				id: "id",
				accessor: (p) => p.id,
			},
			{
				Header: honoredOn,
				id: "honoredOn",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<>
						{value.mmm}, {value.yyy}
					</>
				),
			},
			{
				Header: name,
				id: "name",
				accessor: (p) => p.name,
			},
			{
				Header: rank,
				id: "rank",
				accessor: (p) => p.rank,
			},
			{
				Header: department,
				id: "department",
				accessor: (p) => p.locationFullName,
			},
			{
				Header: actions,
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={value.id}
						detailPageLink={`${value.id}`}
						showView={false}
						showEdit={privileges?.updatePrivilege}
						showDelete={privileges?.deletePrivilege}
						onEdit={() => editClickHandler(value.id)} onDelete={function (id: Id): void {
							throw new Error("Function not implemented.");
						} }					/>
				),
			},
		],
		[
			privileges,
			actions,
			txtId,
			honoredOn,
			name,
			rank,
			department,
			editClickHandler,
		]
	);

	return (
		<div className={styles.honors}>
			{privileges?.insertPrivilege && (
				<ShadowedContainer className={styles.section}>
					<RedirectButton
						label={t("button.add", { framework: "React" })}
						redirectTo={RoutePath.HONORS_NEW}
					/>
				</ShadowedContainer>
			)}

			<div>
				<PaginatedTable
					totalCountText={t("news.count", { framework: "React" })}
					totalCount={totalCount}
					pageSize={pageSize}
					data={honors}
					columns={columns}
					onSearch={() => {}}
					onTableSort={() => {}}
					onPageChange={pageChangeHandler}
					onPageViewSelectionChange={pageViewSelectionHandler}
					noRecordText={t("table.noNews", { framework: "React" })}
				/>
			</div>
		</div>
	);
};

export default HonorsHomePage;
