import { useTranslation } from "react-i18next";
import {
	ActionButtons,
	PageContainer,
	PaginatedTable,
	ShadowedContainer,
} from "../../../components";
import {
	DropdownOption,
	Props as DropdownProps,
} from "../../../components/Dropdown";
import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { useEffect, useMemo, useState } from "react";
import { APIDepartmentItem } from "../../../api/departments/types";
import { Id, ROLE } from "../../../utils";
import { DepartmentColumns } from "../../../components/PaginatedTable/types";
import { Column } from "react-table";
import * as RoutePath from "../../../RouteConfig";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getEmirates } from "../../../api/emirates/get/getEmirates";
import { getDepartmentLevels } from "../../../api/departmentLevel/get/getDepartmentLevels";

const DepartmentHomePage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const role = useStore((state) => state.loggedInUser.role);
	const [canView, setCanView] = useState(false);

	const [keyword, setKeyword] = useState("");

	const [levelOptions, setLevelOptions] = useState<DropdownOption[]>([]);
	const [emirateOptions, setEmirateOptions] = useState<DropdownOption[]>([]);

	const [departments, setDepartments] = useState<APIDepartmentItem[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [orderBy, setOrderBy] = useState<string>("Id");

	const [toggleSort, setToggleSort] = useState(false);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();

	const [selectedLevelCode, setSelectedLevelCode] = useState<Id>();
	const [emirateId, setEmirateId] = useState<Id>();

	const id = t("department.id", { framework: "React" });
	const departmentName = t("department.name", { framework: "React" });
	const level = t("department.level", { framework: "React" });
	const parentDept = t("department.parent", {
		framework: "React",
	});
	const emirate = t("emirate.name", {
		framework: "React",
	});

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const detail = t("button.detail", { framework: "React" });

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentLevels();

			if (data) {
				setLevelOptions(
					data.map((x) => ({
						label: `${x.id} - ${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getEmirates();

			if (data) {
				setEmirateOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	const columns: Column<DepartmentColumns>[] = [
		{
			Header: id,
			id: "id",
			accessor: (p) => p.id,
		},
		{
			Header: departmentName,
			id: "name",
			accessor: (p) => (
				<div className={styles.name}>
					<div className={styles.arabic}>{p.name}</div>
					<div>{p.nameEnglish}</div>
				</div>
			),
		},
		{
			Header: level,
			id: "level",
			accessor: (p) =>
				p.parent ? (
					<div className={styles.name}>
						<div className={styles.arabic}>{p.level?.name!}</div>
						<div>{p.level?.nameEnglish}</div>
					</div>
				) : (
					<div className={styles.name}>-</div>
				),
		},
		// {
		// 	Header: deptFullName,
		// 	id: "fullName",
		// 	accessor: (p) => p.fullName,
		// },
		// {
		// 	Header: deptFullNameEnglish,
		// 	id: "fullNameEnglish",
		// 	accessor: (p) => p.fullNameEnglish,
		// },
		{
			Header: parentDept,
			id: "parent",
			accessor: (p) =>
				p.parent ? (
					<div className={styles.name}>
						<div className={styles.arabic}>{p.parent?.name!}</div>
						<div>{p.parent?.nameEnglish!}</div>
					</div>
				) : (
					<div className={styles.name}>-</div>
				),
		},
		{
			Header: emirate,
			id: "emirate",
			accessor: (p) =>
				p.parent ? (
					<div className={styles.name}>
						<div className={styles.arabic}>{p.emirate?.name!}</div>
						<div>{p.emirate?.nameEnglish!}</div>
					</div>
				) : (
					<div>-</div>
				),
		},
		// {
		// 	Header: projectGroupEnglish,
		// 	accessor: (p) => p.group?.nameEnglish,
		// },
		// {
		// 	Header: status,
		// 	id: "activeStatus",
		// 	accessor: (p) => p,
		// 	Cell: ({ value }: any) => (
		// 		<ActiveStatus
		// 			code={value.activeStatus?.id!}
		// 			text={
		// 				language !== "ar"
		// 					? value.activeStatus.nameArabic
		// 					: value.activeStatus.nameEnglish
		// 			}
		// 		/>
		// 	),
		// },
		{
			id: "actions",
			accessor: (p) => p,
			Cell: ({ value }: any) => (
				<ActionButtons
					id={""}
					// showView={true}
					detailPageLink={`${RoutePath.DEPARTMENT}/${value.id}`}
					editPageLink={`${RoutePath.DEPARTMENT}/${value.id}/edit`}
					showEdit={true}
				/>
			),
		},
	];

	const fetchDepartments = useMemo(
		() => async () => {
			const { data, error } = await getDepartments(
				currentPage,
				pageSize,
				keyword,
				selectedLevelCode,
				emirateId,
				selectedStatusCode,
				orderBy,
				toggleSort
			);
			if (error) {
				if (error?.response!.status! === 403) {
					setCanView(false);
				}
			}

			if (data) {
				setDepartments(data?.departments);
				setTotalCount(data?.totalItems);
				setPageSize(data?.pageSize);
			}
		},
		[
			currentPage,
			pageSize,
			keyword,
			selectedLevelCode,
			emirateId,
			selectedStatusCode,
			orderBy,
			toggleSort,
		]
	);

	useEffect(() => {
		if (role === ROLE.USER || role === "") {
			setCanView(false);
			return;
		} else {
			fetchDepartments();
			setCanView(true);
		}
	}, [fetchDepartments, currentPage, pageSize, role]);

	const departmentSearchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const pageChangeHandler = (currentPage: number) => {
		setCurrentPage(currentPage);
	};

	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;
		setPageSize(size);
	};

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);

		setOrderBy(columnId);
		setCurrentPage(1);
	};

	const levelSelectHandler = (option: DropdownOption) => {
		setSelectedLevelCode(option?.value!);
	};

	const emirateSelectHandler = (option: DropdownOption) => {
		setEmirateId(option?.value!);
	};

	const dropdowns: { [key: string]: DropdownProps } = {
		levels: {
			options: levelOptions,
			onSelect: levelSelectHandler,
			placeholder: t("department.level", { framework: "React" }),
		},
		emirates: {
			options: emirateOptions,
			onSelect: emirateSelectHandler,
			placeholder: t("emirate.name", { framework: "React" }),
		},
	};

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			title={t("page.departmentHome", { framework: "React" })}
			showAddButton={role === ROLE.SUPERADMIN}
			btnAddLabel={t("button.addNewDepartment", { framework: "React" })}
			btnAddUrlLink={RoutePath.DEPARTMENT_NEW}
			className={styles.departmentsList}>
			<div className={styles.content}>
				<ShadowedContainer className={styles.table}>
					<PaginatedTable
						totalCountText={"Total Count"}
						totalCount={totalCount}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageSize={pageSize}
						data={departments}
						columns={columns}
						dropdowns={dropdowns}
						noRecordText={""}
						onSearch={departmentSearchClickHandler}
						onTableSort={tableSortHandler}
						onPageChange={pageChangeHandler}
						onPageViewSelectionChange={pageViewSelectionHandler}
						hideActiveStatusDropdown
					/>
				</ShadowedContainer>
			</div>
		</PageContainer>
	);
};

export default DepartmentHomePage;
