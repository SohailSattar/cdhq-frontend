import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ColumnFiltersState, createColumnHelper } from "@tanstack/react-table";
import { APIExportHonor, APIHonor } from "../../../api/honors/types";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import {
	ActionButtons,
	PhotoThumbnailImage,
	PaginatedTable,
	PageContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { HonorColumn } from "../../../components/PaginatedTable/types";
import { Project } from "../../../data/projects";
import { enGB, ar } from "date-fns/locale";

import * as RoutePath from "../../../RouteConfig";
import { Id } from "../../../utils";

import styles from "./styles.module.scss";
import { APIExportData, APIStatus } from "../../../api";
import { updateHonorStatus } from "../../../api/honors/update/updateHonorStatus";
import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";
import { format } from "date-fns";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { exportHonors } from "../../../api/honors/export/exportHonors";
import { getRanks } from "../../../api/ranks/get/getRanks";
import { getFilteredHonors } from "../../../api/honors/get/getFilteredHonors";

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

	const [rankOptions, setRankOptions] = useState<DropdownOption[]>([]);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	//Parameters
	const [toggleSort, setToggleSort] = useState(true);
	const [orderBy, setOrderBy] = useState<string>("createdOn");

	const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

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

				// if (columnFilters.length > 0) {
				const { data } = await getFilteredHonors(
					columnFilters,
					currentPage,
					pageSize,
					keyword,
					selectedStatusCode,
					orderBy,
					toggleSort
				);

				if (data) {
					setHonors(data.honors);
					setTotalCount(data.totalItems);
				} else {
					// navigate(RoutePath.ROOT);
				}
				// } else {
				// 	const { data } = await getHonors(
				// 		currentPage,
				// 		pageSize,
				// 		keyword,
				// 		selectedStatusCode,
				// 		orderBy,
				// 		toggleSort
				// 	);

				// 	if (data) {
				// 		setHonors(data.honors);
				// 		setTotalCount(data.totalItems);
				// 	} else {
				// 		// navigate(RoutePath.ROOT);
				// 	}
				// }
			}
		},
		[
			columnFilters,
			currentPage,
			keyword,
			orderBy,
			pageSize,
			selectedStatusCode,
			toggleSort,
		]
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

	const typeOptions: DropdownOption[] = useMemo(
		() => [
			{
				label: "موهوب",
				value: "موهوب",
			},
			{
				label: "متميز",
				value: "متميز",
			},
		],
		[]
	);

	const txtId = t("honor.id", { framework: "React" });
	const honoredOn = t("honor.honoredOn", { framework: "React" });
	const name = t("honor.name", { framework: "React" });
	const rank = t("rank.name", { framework: "React" });
	const department = t("department.name", { framework: "React" });
	const section = t("department.section", { framework: "React" });
	const honorType = t("honor.type.name", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const status = t("global.status", { framework: "React" });

	const columnHelper = createColumnHelper<HonorColumn>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.imageName, {
				id: "imageName",
				header: "",
				cell: (info) => <PhotoThumbnailImage src={info.getValue()!} />,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: txtId,
			}),
			columnHelper.accessor((row) => row.createdOn, {
				id: "honoredOn",
				cell: (info) => (
					<>
						{format(new Date(info.getValue()!), "dd MMMM yyyy", {
							locale: language !== "ar" ? ar : enGB,
						})}
					</>
				),
				header: () => honoredOn,
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row, {
				id: "fullName",
				cell: (info) => (
					<div className={styles.name}>
						{language !== "ar"
							? info.getValue()!.name
							: info.getValue()!.nameEnglish}
					</div>
				),
				header: () => name,
			}),
			columnHelper.accessor((row) => row, {
				id: "rank",
				cell: (info) => (
					<div className={styles.name}>
						{language !== "ar"
							? info.getValue()!.rank!
							: info.getValue()!.rankEnglish}
					</div>
				),
				header: () => rank,
				meta: {
					filterVariant: "select",
					options: rankOptions,
				},
			}),
			columnHelper.accessor((row) => row.department, {
				id: "departmentId",
				cell: (info) => (
					<div className={styles.name}>
						{info.getValue()
							? language !== "ar"
								? info.getValue()?.name!
								: info.getValue()?.nameEnglish!
							: "-"}
					</div>
				),
				header: () => department,
				meta: {
					filterVariant: "select",
					options: departmentOptions,
				},
			}),
			columnHelper.accessor((row) => row.type, {
				id: "type",
				cell: (info) => <div className={styles.name}>{info.getValue()!}</div>,
				header: () => honorType,
				meta: {
					filterVariant: "select",
					options: typeOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "action",
				header: "",
				cell: (info) => (
					<ActionButtons
						id={info.getValue()?.id}
						showActivate={info.getValue()?.activeStatus.id !== 1}
						onActivate={(id) => activateClickHandler(id)}
						showEdit={privileges?.updatePrivilege}
						onEdit={(id) => editClickHandler(info.getValue()?.id!.toString())}
					/>
				),
				enableColumnFilter: false,
			}),
		],
		[
			activateClickHandler,
			columnHelper,
			department,
			departmentOptions,
			editClickHandler,
			honorType,
			honoredOn,
			language,
			name,
			privileges?.updatePrivilege,
			rank,
			rankOptions,
			txtId,
			typeOptions,
		]
	);

	// const columns: Column<HonorColumn>[] = useMemo(
	// 	() => [
	// 		{
	// 			id: "img",
	// 			accessor: (p) => p.imageName,
	// 			Cell: ({ value }: any) => <PhotoThumbnailImage src={value!} />,
	// 		},
	// 		{
	// 			Header: txtId,
	// 			id: "id",
	// 			accessor: (p) => p.id,
	// 		},
	// 		{
	// 			Header: honoredOn,
	// 			id: "createdOn",
	// 			accessor: (p) => p.createdOn,
	// 			Cell: ({ value }: any) => (
	// 				<>
	// 					{format(new Date(value!), "dd MMMM yyyy", {
	// 						locale: language !== "ar" ? ar : enGB,
	// 					})}
	// 				</>
	// 			),
	// 		},
	// 		{
	// 			Header: name,
	// 			id: "name",
	// 			accessor: (p) => p,
	// 			Cell: ({ value }: any) => (
	// 				<div className={styles.name}>
	// 					{language !== "ar" ? value.name : value.nameEnglish}
	// 				</div>
	// 			),
	// 		},
	// 		{
	// 			Header: rank,
	// 			id: "rank",
	// 			accessor: (p) => p,
	// 			Cell: ({ value }: any) => (
	// 				<div className={styles.name}>
	// 					{language !== "ar" ? value.rank : value.rankEnglish}
	// 				</div>
	// 			),
	// 		},
	// 		{
	// 			Header: department,
	// 			id: "department",
	// 			accessor: (p) => p,
	// 			Cell: ({ value }: any) => (
	// 				<div className={styles.name}>
	// 					{language !== "ar"
	// 						? value.department?.name!
	// 						: value.department?.name!}
	// 				</div>
	// 			),
	// 		},
	// 		{
	// 			Header: honorType,
	// 			id: "type",
	// 			accessor: (p) => p.type,
	// 		},
	// 		{
	// 			Header: actions,
	// 			id: "actions",
	// 			accessor: (p) => p,
	// 			Cell: ({ value }: any) => (
	// 				<ActionButtons
	// 					id={value.id}
	// 					showActivate={value.activeStatus.id !== 1}
	// 					onActivate={(id) => activateClickHandler(id)}
	// 					showEdit={privileges?.updatePrivilege}
	// 					onEdit={(id) => editClickHandler(value.id)}
	// 				/>
	// 			),
	// 		},
	// 	],
	// 	[
	// 		txtId,
	// 		honoredOn,
	// 		name,
	// 		rank,
	// 		department,
	// 		honorType,
	// 		actions,
	// 		language,
	// 		privileges?.updatePrivilege,
	// 		activateClickHandler,
	// 		editClickHandler,
	// 	]
	// );

	const fetchRanks = useCallback(async () => {
		const { data } = await getRanks();
		if (data) {
			setRankOptions(
				data?.map((x) => {
					return {
						label: language !== "ar" ? x.name : x.nameEnglish,
						value: language !== "ar" ? x.name : x.nameEnglish,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchRanks();
	}, [fetchRanks]);

	const fetchDepartments = useCallback(async () => {
		const { data } = await getDepartmentsByProject(Project.Honors);
		if (data) {
			setDepartmentOptions(
				data?.map((x) => {
					return {
						label: `${x.id} - ${
							language !== "ar" ? x.fullName : x.fullNameEnglish
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

	// For Export
	const propertyDisplayNames: Record<
		keyof APIExportHonor,
		Record<string, string>
	> = {
		name: { value: "Name", text: name },
		rank: { value: "Rank", text: rank },
		department: { value: "Department", text: department },
		section: { value: "Section", text: section },
		honoredOn: { value: "HonoredOn", text: honoredOn },
		honorType: { value: "HonorType", text: honorType },
	};

	const exportDataHandler = async (data: APIExportData) => {
		setIsExportLoading(true);
		const dataValues: APIExportData = {
			...data,
			language: language === "ar" ? "en" : "ar",
			queryParams: {
				page: currentPage,
				postsPerPage: pageSize,
				keyword: keyword,
				statusCode: selectedStatusCode,
				orderBy: orderBy,
				isDescending: toggleSort,
				...(departmentId && { departmentId: departmentId }), // Only include departmentId if it has a value
			},
		};

		const us = t("honor.title", { framework: "React" });
		const currentDate = format(new Date(), "ddMMyyyyhhmmss", {
			locale: language !== "ar" ? ar : enGB,
		});
		const fileName = `${us}_${currentDate}.${data.format}`;
		const { data: fData, error } = await exportHonors(dataValues, fileName);
		if (fData) {
			toast.success(t("message.downloaded", { framework: "React" }).toString());
		}
		if (error) {
			toast.error(
				t("message.unauthorizedExport", { framework: "React" }).toString()
			);
		}
		setIsExportLoading(false);
	};

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
		setToggleSort(!toggleSort);
		setOrderBy(columnId);
		// fetchData(currentPage, orderByParam);
		setCurrentPage(1);
	};

	const departmentSelectHandler = (option: DropdownOption) => {
		setDepartmentId(option?.value!);
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<PageContainer
			// displayContent={privileges?.readPrivilege}
			title={t("honor.title", { framework: "React" })}
			showAddButton={privileges?.insertPrivilege}
			btnAddUrlLink={RoutePath.HONORS_NEW}
			btnAddLabel={t("button.add", { framework: "React" })}
			isExportSelectionLoading={isExportLoading}
			displayExportButton={false}
			exportDisplayNames={propertyDisplayNames}
			onExcelExport={exportDataHandler}
			onPdfExport={exportDataHandler}
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
				noRecordText={t("table.noHonor", { framework: "React" })}
				hideActiveStatusDropdown
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				columnsToHide={
					privileges?.updatePrivilege || privileges?.deletePrivilege
						? []
						: ["actions"]
				}
				onColumnFiltersChange={handleColumnFiltersChange}
			/>
		</PageContainer>
	);
};

export default HonorsHomePage;
function setColumnFilters(
	newColumnFilters: SetStateAction<ColumnFiltersState>
) {
	throw new Error("Function not implemented.");
}
