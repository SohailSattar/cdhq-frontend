import { useTranslation } from "react-i18next";
import {
	ActionButtons,
	ActiveStatus,
	PageContainer,
	PaginatedTable,
} from "../../";

import { useNavigate } from "react-router";
import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { APIPrivileges } from "../../../api/privileges/type";
import { DropdownOption, Props as DropdownProps } from "../../Dropdown";
import {
	Column,
	ColumnFiltersState,
	createColumnHelper,
} from "@tanstack/react-table";
import { ImageColumn } from "../../PaginatedTable/types";
import { useStore } from "../../../utils/store";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { Id } from "../../../utils";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { APIStatus } from "../../../api";
import { APIRole } from "../../../api/roles/types";
import { APIImage } from "../../../api/images/types";
import { getImagesList } from "../../../api/images/get/getImagesList";
import { deleteImage } from "../../../api/images/delete/deleteImage";
import { updateImageStatus } from "../../../api/images/update/updateImageStatus";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { getImageTypes } from "../../../api/imageType/get/getImageTypes";
import { getFilteredImages } from "../../../api/images/get/getFilteredImages";

const ImagesTable = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const [role, setRole] = useState<APIRole>();

	const [images, setImages] = useState<APIImage[]>([]);

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	const [typeId, setTypeId] = useState<Id>();

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>();
	const [orderBy, setOrderBy] = useState<string>("");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [typeOptions, setTypeOptions] = useState<DropdownOption[]>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
		{ id: "activeStatusId", value: "1" },
	]);

	const [loadingData, setIsLoadingData] = useState<boolean>(false);

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
			const { data: privilege } = await getProjectPrivilege(
				Project.ContentManagement
			);
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
			}
		};

		fetch();
	}, [setPrivileges]);

	const fetchLinkTypes = useCallback(async () => {
		const { data } = await getImageTypes();
		if (data) {
			setTypeOptions(
				data?.map((x) => {
					return {
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchLinkTypes();
	}, [fetchLinkTypes]);

	const fetch = useMemo(
		() => async () => {
			setIsLoadingData(true);
			const { data, error } = await getFilteredImages(columnFilters, {
				page: currentPage,
				postsPerPage: pageSize,
				keyword,
				orderBy,
			});

			// if (error?.response!.status! === 401) {
			// 	navigate(RoutePath.LOGIN);
			// } else if (error?.response!.status! === 403) {
			// 	return;
			// }

			if (data) {
				setImages(data.images);
				setTotalCount(data.totalItems);
			}
			setIsLoadingData(false);
		},
		[columnFilters, currentPage, pageSize, keyword, orderBy]
	);

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};
			setIsLoadingData(true);
			const { data, error } = await updateImageStatus(params);

			if (data) {
				fetch();
				toast.success(
					t("message.imageActivated", { framework: "React" }).toString()
				);
			}

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
			}
			setIsLoadingData(false);
		},
		[fetch, t]
	);

	const editClickHandler = useMemo(
		() => (id: string) => {
			navigate(`${RoutePath.CONTENT_MANAGEMENT_IMAGE}/${id}/edit`);
		},
		[navigate]
	);

	const deleteClickHandler = useMemo(
		() => async (id: Id) => {
			const { data, error } = await deleteImage(id);
			setIsLoadingData(true);
			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				toast.success(
					t("message.imageDeleted", { framework: "React" }).toString()
				);
				fetch();
			}
			setIsLoadingData(false);
		},
		[fetch, t]
	);

	const id = t("image.id", { framework: "React" });
	const name = t("image.name", { framework: "React" });
	const type = t("image.type", { framework: "React" });
	const ratings = t("image.ratings", { framework: "React" });

	const status = t("global.status", { framework: "React" });

	const actions = t("global.actions", { framework: "React" });
	const activate = t("button.activate", { framework: "React" });
	const edit = t("button.edit", { framework: "React" });
	const deleteBtn = t("button.deactivate", { framework: "React" });

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

	const columnHelper = createColumnHelper<ImageColumn>();
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.imageName, {
				id: "imageName",
				header: name,
				cell: (info) => (
					<div className={styles.cell}>
						<img
							src={info.getValue()}
							alt="#"
							className={styles.thumbnail}
						/>
					</div>
				),
				enableColumnFilter: false,
			}),
			columnHelper.accessor((row) => row.id, {
				id: "id",
				header: id,
				cell: (info) => <div className={styles.cell}>{info.getValue()}</div>,
			}),
			columnHelper.accessor((row) => row, {
				id: "name",
				header: name,
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{info.getValue().name}</div>
						<div className={styles.english}>{info.getValue().nameEnglish}</div>
					</div>
				),
			}),
			columnHelper.accessor((row) => row.imageType, {
				id: "imageTypeId",
				header: type,
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{info.getValue().name}</div>
						<div className={styles.english}>{info.getValue().nameEnglish}</div>
					</div>
				),
				meta: {
					filterVariant: "select",
					options: typeOptions,
				},
			}),
			columnHelper.accessor((row) => row, {
				id: "stars",
				header: ratings,
				cell: (info) => (
					<div className={styles.name}>
						<div className={styles.arabic}>
							{info.getValue()!.imageType.id === 2 && (
								<Rating
									value={info.getValue()!.stars}
									readOnly
									size="large"
								/>
							)}
						</div>
					</div>
				),
				enableColumnFilter: false,
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
						id={info.getValue().id}
						showActivate={info.getValue().activeStatus.id !== 1}
						onActivate={(id) => activateClickHandler(id)}
						showEdit={true}
						onEdit={(id) => editClickHandler(id)}
						showDelete={
							privileges?.deletePrivilege &&
							info.getValue().activeStatus.id === 1
						}
						onDelete={deleteClickHandler}
					/>
				),
				enableColumnFilter: false,
			}),
		],
		[
			actions,
			activateClickHandler,
			activeStatusOptions,
			columnHelper,
			deleteClickHandler,
			editClickHandler,
			id,
			language,
			name,
			privileges?.deletePrivilege,
			ratings,
			status,
			type,
			typeOptions,
		]
	);

	useEffect(() => {
		fetch();
	}, [fetch, role]);

	const searchHandler = (keyword: string) => {
		setKeyword(keyword);

		if (keyword !== "") {
			setSelectedStatusCode("");
		} else {
			setSelectedStatusCode("1");
		}
		setCurrentPage(1);
	};

	const pageChangeHandler = (currentpage: number) => {
		setCurrentPage(currentpage);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
		setCurrentPage(1);
	};

	const handleColumnFiltersChange = async (
		newColumnFilters: SetStateAction<ColumnFiltersState>
	) => {
		setColumnFilters(newColumnFilters);
	};

	return (
		<>
			<PaginatedTable
				totalCountText={t("news.count", { framework: "React" })}
				totalCount={totalCount}
				pageSize={pageSize}
				data={images}
				columns={columns}
				onSearch={searchHandler}
				onTableSort={() => {}}
				onPageChange={pageChangeHandler}
				onPageViewSelectionChange={pageViewSelectionHandler}
				noRecordText={t("table.noNews", { framework: "React" })}
				hideActiveStatusDropdown
				onColumnFiltersChange={handleColumnFiltersChange}
				isLoading={loadingData}
			/>
		</>
	);
};

export default ImagesTable;
