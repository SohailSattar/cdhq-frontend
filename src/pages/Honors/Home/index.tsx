import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { getHonors } from "../../../api/honors/get/getHonors";
import { APIHonor } from "../../../api/honors/types";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import {
	ActionButtons,
	PhotoThumbnailImage,
	PaginatedTable,
	RedirectButton,
	ShadowedContainer,
	ActiveStatus,
	PageContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { HonorColumn } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";
import { APIStatus } from "../../../api";
import { updateHonorStatus } from "../../../api/honors/update/updateHonorStatus";
import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";

const HonorsHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [honors, setHonors] = useState<APIHonor[]>([]);

	const [keyword, setKeyword] = useState("");

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);
	const [orderBy, setOrderBy] = useState<string>("");

	const fetchData = useMemo(
		() => async () => {
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

				const { data } = await getHonors(
					currentPage,
					pageSize,
					keyword,
					selectedStatusCode,
					orderBy
				);

				if (data) {
					setHonors(data.honors);
					setTotalCount(data.totalItems);
				} else {
					// navigate(RoutePath.ROOT);
				}
			}
		},
		[currentPage, keyword, orderBy, pageSize, selectedStatusCode]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData, currentPage, pageSize]);

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
		// fetchData(currentpage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

			const { data, error } = await updateHonorStatus(params);

			if (data) {
				fetchData();
				toast.success(
					t("message.honorActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
		},
		[fetchData, t]
	);

	const editClickHandler = useMemo(
		() => (id: string) => {
			const editPath = RoutePath.HONORS_EDIT.replace(RoutePath.ID, id);
			navigate(editPath);
		},
		[navigate]
	);

	const deleteClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 9,
			};

			const { data, error } = await updateHonorStatus(params);

			if (data) {
				fetchData();
				toast.error(
					t("message.honorDeactivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
		},
		[fetchData, t]
	);

	const txtId = t("honor.id", { framework: "React" });
	const honoredOn = t("honor.honoredOn", { framework: "React" });
	const name = t("honor.name", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const status = t("global.status", { framework: "React" });

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
				id: "createdOn",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<>
						{value.mmm} / {value.yyy}
					</>
				),
			},
			{
				Header: name,
				id: "name",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar" ? value.name : value.nameEnglish}
					</div>
				),
			},
			{
				Header: rank,
				id: "rank",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar" ? value.rank : value.rankEnglish}
					</div>
				),
			},
			{
				Header: department,
				id: "department",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						{language !== "ar"
							? value.department?.name!
							: value.department?.name!}
					</div>
				),
			},
			{
				Header: status,
				id: "activeStatus",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>
							<ActiveStatus
								code={value.activeStatus.id === 1 ? 1 : 9}
								text={
									language !== "ar"
										? value.activeStatus.nameArabic
										: value.activeStatus.nameEnglish
								}
							/>
						</div>
					</div>
				),
			},
			{
				Header: actions,
				id: "actions",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<ActionButtons
						id={value.id}
						showActivate={value.activeStatus.id !== 1}
						onActivate={(id) => activateClickHandler(id)}
						showEdit={privileges?.updatePrivilege}
						onEdit={(id) => editClickHandler(value.id)}
						showDelete={
							privileges?.deletePrivilege && value.activeStatus.id === 1
						}
						onDelete={deleteClickHandler}
					/>
				),
			},
		],
		[
			txtId,
			honoredOn,
			name,
			rank,
			department,
			status,
			actions,
			language,
			privileges?.updatePrivilege,
			privileges?.deletePrivilege,
			deleteClickHandler,
			activateClickHandler,
			editClickHandler,
		]
	);

	console.log(honors);

	const searchHandler = (keyword: string) => {
		setKeyword(keyword);

		if (keyword !== "") {
			setSelectedStatusCode("");
		} else {
			setSelectedStatusCode("1");
		}
		setCurrentPage(1);
	};

	const statusSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			if (option) {
				setSelectedStatusCode((prevState) => (prevState = option?.value!));
			} else {
				setSelectedStatusCode(1);
			}
			setCurrentPage(1);
		},
		[]
	);

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		let orderByParam = "";
		setToggleSort(!toggleSort);
		if (toggleSort) {
			orderByParam = `&OrderBy=${columnId}`;
		} else {
			orderByParam = `&OrderByDesc=${columnId}`;
		}

		setOrderBy(orderByParam);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	return (
		<PageContainer
			// displayContent={privileges?.readPrivilege}
			title={t("honor.title", { framework: "React" })}
			showAddButton={privileges?.insertPrivilege}
			btnAddUrlLink={RoutePath.HONORS_NEW}
			btnAddLabel={t("button.add", { framework: "React" })}
			className={styles.honors}>
			<PaginatedTable
				totalCountText={t("news.count", { framework: "React" })}
				totalCount={totalCount}
				pageSize={pageSize}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				data={honors}
				columns={columns}
				onSearch={searchHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noNews", { framework: "React" })}
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				columnsToHide={
					privileges?.updatePrivilege || privileges?.deletePrivilege
						? []
						: ["actions"]
				}
			/>
		</PageContainer>
	);
};

export default HonorsHomePage;
