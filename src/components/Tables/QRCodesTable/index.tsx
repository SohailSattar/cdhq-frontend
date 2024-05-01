import { FC, useEffect, useMemo, useState } from "react";
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
import { Column } from "@tanstack/react-table";
import { DropdownOption } from "../../Dropdown";
import { getQRCodes } from "../../../api/qr-codes/get/getQRCodes";
import { Id } from "../../../utils";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { APIStatus } from "../../../api";
import { toast } from "react-toastify";
import { updateQRCodeStatus } from "../../../api/qr-codes/update/updateQRCodeStatus";

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
	const [statusCode, setStatusCode] = useState<Id>(1);

	//Parameters
	const [orderBy, setOrderBy] = useState<string>("");
	const [toggleSort, setToggleSort] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchData = useMemo(
		() => async () => {
			const { data } = await getQRCodes(
				currentPage,
				pageSize,
				keyword,
				statusCode,
				orderBy,
				toggleSort
			);

			if (data) {
				setItems(data.codes);
				setTotalCount(data.totalItems);
				setPageSize(data?.pageSize);
			}
		},
		[currentPage, keyword, orderBy, pageSize, statusCode, toggleSort]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const editClickHandler = (id: Id) => {
		navigate(
			RoutePath.CONTENT_MANAGEMENT_QR_CODE_EDIT.replace(
				RoutePath.ID,
				id.toString()
			)
		);
	};

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

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
		},
		[fetchData, t]
	);

	const deleteClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 9,
			};

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

	// const columns: Column<QRCodeItemColumns>[] = [
	// 	{
	// 		Header: id,
	// 		id: "id",
	// 		accessor: (p) => p.id,
	// 	},
	// 	{
	// 		id: "image",
	// 		accessor: (p) => (
	// 			<img
	// 				src={p.imageName}
	// 				alt={p.name}
	// 				className={styles.image}
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		Header: name,
	// 		id: "name",
	// 		accessor: (p) => (
	// 			<div>
	// 				{p.iconName && (
	// 					<span>
	// 						<img
	// 							src={p.iconName}
	// 							alt={p.name}
	// 							className={styles.icon}
	// 						/>{" "}
	// 					</span>
	// 				)}
	// 				{language !== "ar" ? p.name : p.nameEnglish}
	// 			</div>
	// 		),
	// 	},
	// 	{
	// 		Header: status,
	// 		id: "activeStatus",
	// 		accessor: (p) => p,
	// 		Cell: ({ value }: any) => (
	// 			<ActiveStatus
	// 				code={value.activeStatus.id === 1 ? 1 : 9}
	// 				text={
	// 					language !== "ar"
	// 						? value.activeStatus.nameArabic
	// 						: value.activeStatus.nameEnglish
	// 				}
	// 			/>
	// 		),
	// 	},

	// 	{
	// 		Header: actions,
	// 		accessor: (p) => p,
	// 		Cell: ({ value }: any) => (
	// 			<ActionButtons
	// 				id={""}
	// 				showActivate={value.activeStatus.id !== 1}
	// 				onActivate={() => activateClickHandler(value.id)}
	// 				// editPageLink={`${RoutePath.USER}/${value.id}/edit`}
	// 				showEdit={canEdit}
	// 				onEdit={() => editClickHandler(value.id)}
	// 				showDelete={canDelete && value.activeStatus.id === 1}
	// 				onDelete={() => deleteClickHandler(value.id)}
	// 			/>
	// 		),
	// 	},
	// ];

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

	const deleteQRCodeCancelHandler = () => {};

	return (
		<>
			{/* <PaginatedTable
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
			/> */}
		</>
	);
};

export default QRCodesTable;
