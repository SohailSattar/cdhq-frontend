import { FC, SetStateAction, useEffect, useMemo, useState } from "react";
import {
	ActionButtons,
	ActiveStatus,
	DeleteConfirmation,
	PaginatedTable,
	StatusIcon,
} from "../..";
import { APIQRCodeItem } from "../../../api/qr-codes/types";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { QRCodeItemColumns } from "../../PaginatedTable/types";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { DropdownOption } from "../../Dropdown";
import { getQRCodes } from "../../../api/qr-codes/get/getQRCodes";
import { Id } from "../../../utils";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { APIStatus } from "../../../api";
import { toast } from "react-toastify";
import { updateQRCodeStatus } from "../../../api/qr-codes/update/updateQRCodeStatus";
import { getFilteredQRCodes } from "../../../api/qr-codes/get/getFilteredQRCodes";

interface Props {
	canEdit: boolean;
	canDelete: boolean;
}

const QRCodesTable: FC<Props> = ({ canEdit = false, canDelete = false }) => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const [items, setItems] = useState<APIQRCodeItem[]>([]);

	const [totalCount, setTotalCount] = useState<number>(0);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(50);

	const [keyword, setKeyword] = useState("");

	// This variable is to set the status code which we can pass to the API
	const [statusCode, setStatusCode] = useState<Id>();

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	const fetchData = useMemo(
		() => async () => {
			setIsLoadingData(true);
			const { data } = await getFilteredQRCodes(columnFilters, {
				page: currentPage,
				postsPerPage: pageSize,
				keyword,
				statusCode,
				orderBy,
				isDescending: toggleSort,
			});

			if (data) {
				setItems(data.codes);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
			setIsLoadingData(false);
		},
		[
			columnFilters,
			currentPage,
			keyword,
			orderBy,
			pageSize,
			statusCode,
			toggleSort,
		]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const editClickHandler = useMemo(
		() => async (id: Id) => {
			navigate(
				RoutePath.CONTENT_MANAGEMENT_QR_CODE_EDIT.replace(
					RoutePath.ID,
					id.toString()
				)
			);
		},
		[navigate]
	);

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

			setIsLoadingData(true);

			const { data, error } = await updateQRCodeStatus(params);

			if (data) {
				fetchData();
				toast.success(
					t("message.recordActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
			setIsLoadingData(false);
		},
		[fetchData, t]
	);

	const deleteClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 9,
			};
			setIsLoadingData(true);
			const { data, error } = await updateQRCodeStatus(params);

			if (data) {
				fetchData();
				toast.error(
					t("message.recordDeactivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
			setIsLoadingData(false);
		},
		[fetchData, t]
	);

	const id = t("image.id", { framework: "React" });
	const image = t("image.name", { framework: "React" });
	const name = t("image.name", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	//Actions
	const actions = t("global.actions", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });

	const activeStatusOptions: DropdownOption[] = useMemo(
		() => [
			{
				label: t("status.active", {
					framework: "React",
				}),
				value: 1,
			},
			{
				label: t("status.deactive", {
					framework: "React",
				}),
				value: 9,
			},
		],
		[t]
	);

	const columnHelper = createColumnHelper<QRCodeItemColumns>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: id,
			}),
			columnHelper.accessor((row) => row, {
				id: "image",
				header: "",
				cell: (info) => (
					<img
						src={info.getValue().imageName}
						alt={info.getValue().name}
						className={styles.image}
					/>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row, {
				id: "name",
				header: name,
				cell: (info) => (
					<div>
						{info.getValue().iconName && (
							<span>
								<img
									src={info.getValue().iconName}
									alt={info.getValue().name}
									className={styles.icon}
								/>{" "}
							</span>
						)}
						{language !== "ar"
							? info.getValue().name
							: info.getValue().nameEnglish}
					</div>
				),
			}),
			columnHelper.accessor((row) => row.activeStatus, {
				id: "activeStatusId",
				header: status,
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>
							<ActiveStatus
								code={info.getValue()!.id === 1 ? 1 : 9}
								text={
									language !== "ar"
										? info.getValue()!.nameArabic
										: info.getValue()!.nameEnglish
								}
							/>
						</div>
					</div>
				),
				meta: {
					filterVariant: "select",
					options: activeStatusOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "actions",
				header: actions,
				cell: (info) => (
					<ActionButtons
						id={""}
						showActivate={info.getValue().activeStatus.id !== 1}
						onActivate={() => activateClickHandler(info.getValue().id)}
						showEdit={canEdit}
						onEdit={() => editClickHandler(info.getValue().id)}
						showDelete={canDelete && info.getValue().activeStatus.id === 1}
						onDelete={() => deleteClickHandler(info.getValue().id)}
					/>
				),
				enableColumnFilter: false,
			}),
		],
		[
			actions,
			activateClickHandler,
			activeStatusOptions,
			canDelete,
			canEdit,
			columnHelper,
			deleteClickHandler,
			editClickHandler,
			id,
			language,
			name,
			status,
		]
	);

	const searchClickHandler = (keyword: string) => {
		setKeyword(keyword);
	};

	const statusSelectHandler = useMemo(
		() => (option: DropdownOption) => {
			if (option) {
				setStatusCode((prevState) => (prevState = option?.value!));
			} else {
				setStatusCode(1);
			}
			setCurrentPage(1);
		},
		[]
	);

	const tableSortHandler = (columnId: string, isSortedDesc: boolean) => {
		setToggleSort(!toggleSort);

		setOrderBy(columnId);
		setCurrentPage(1);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<>
			<PaginatedTable
				totalCountText={t("menu.count", { framework: "React" })}
				totalCount={totalCount}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				data={items}
				columns={columns}
				noRecordText={t("table.noResult", { framework: "React" })}
				onSearch={searchClickHandler}
				onActiveStatusOptionSelectionChange={statusSelectHandler}
				onTableSort={tableSortHandler}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				onColumnFiltersChange={handleColumnFiltersChange}
				isLoading={loadingData}
			/>
		</>
	);
};

export default QRCodesTable;
