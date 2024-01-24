import { useCallback, useEffect, useMemo, useState } from "react";
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
	PageContainer,
} from "../../../components";
import {
	DropdownOption,
	Props as DropdownProps,
} from "../../../components/Dropdown";
import { HonorColumn } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";
import { enGB, ar } from "date-fns/locale";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";
import { APIStatus } from "../../../api";
import { updateHonorStatus } from "../../../api/honors/update/updateHonorStatus";
import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";
import { format } from "date-fns";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";

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
	const [departmentId, setDepartmentId] = useState<Id>("");
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);

	//Parameters
	const [toggleSort, setToggleSort] = useState(false);
	const [orderBy, setOrderBy] = useState<string>("&OrderByDesc=createdOn");

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
	const honorType = t("honor.type.name", { framework: "React" });

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
				accessor: (p) => p.createdOn,
				Cell: ({ value }: any) => (
					<>
						{format(new Date(value!), "dd MMMM yyyy", {
							locale: language !== "ar" ? ar : enGB,
						})}
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
				Header: honorType,
				id: "type",
				accessor: (p) => p.type,
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
			honorType,
			actions,
			language,
			privileges?.updatePrivilege,
			activateClickHandler,
			editClickHandler,
		]
	);

	const fetchDepartments = useCallback(async () => {
		const { data } = await getDepartmentsByProject(Project.Honors);
		if (data) {
			setDepartmentOptions(
				data?.map((x) => {
					return {
						label: `${x.id} - ${
							language !== "ar" ? x.longFullName : x.longFullNameEnglish
						}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

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

	const departmentSelectHandler = (option: DropdownOption) => {
		setDepartmentId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		department: {
			options: departmentOptions,
			onSelect: departmentSelectHandler,
		},
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
				dropdowns={dropdowns}
				onSearch={searchHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noNews", { framework: "React" })}
				hideActiveStatusDropdown
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
