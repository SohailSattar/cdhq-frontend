import { useTranslation } from "react-i18next";
import {
	ActionButtons,
	ActiveStatus,
	PageContainer,
	PaginatedTable,
} from "../../../components";

import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { APIPrivileges } from "../../../api/privileges/type";
import { DropdownOption } from "../../../components/Dropdown";
import { Column } from "react-table";
import { ImageColumn } from "../../../components/PaginatedTable/types";
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

const ImageManagementHomePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const [role, setRole] = useState<APIRole>();

	const [images, setImages] = useState<APIImage[]>([]);

	const [keyword, setKeyword] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalCount, setTotalCount] = useState<number>(0);

	// This variable is to set the status code which we can pass to the API
	const [selectedStatusCode, setSelectedStatusCode] = useState<Id>(1);
	const [orderBy, setOrderBy] = useState<string>("");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
			const { data: privilege } = await getProjectPrivilege(
				Project.ImageManagement
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
	}, [role?.name, setPrivileges]);

	const fetch = useMemo(
		() => async () => {
			const { data, error } = await getImagesList(
				currentPage,
				pageSize,
				keyword,
				1,
				selectedStatusCode,
				orderBy
			);

			// if (error?.response!.status! === 401) {
			// 	navigate(RoutePath.LOGIN);
			// } else if (error?.response!.status! === 403) {
			// 	return;
			// }

			if (data) {
				setImages(data.images);
				setTotalCount(data.totalItems);
			}
		},
		[currentPage, pageSize, keyword, selectedStatusCode, orderBy]
	);

	const activateClickHandler = useMemo(
		() => async (upId: Id) => {
			const params: APIStatus = {
				id: upId,
				activeStatusId: 1,
			};

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
		},
		[fetch, t]
	);

	const editClickHandler = useMemo(
		() => (id: string) => {
			navigate(`${RoutePath.IMAGE_MANAGING}/${id}/edit`);
		},
		[navigate]
	);

	const deleteClickHandler = useMemo(
		() => async (id: Id) => {
			const { data, error } = await deleteImage(id);

			if (error) {
				toast.error(error.ErrorMessage);
			}

			if (data) {
				toast.success(
					t("message.imageDeleted", { framework: "React" }).toString()
				);
				fetch();
			}
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

	const columns: Column<ImageColumn>[] = useMemo(
		() => [
			{
				id: "imageName",
				accessor: (p) => p.imageName,
				Cell: ({ value }: any) => (
					<div className={styles.cell}>
						<img
							src={value}
							alt="#"
							className={styles.thumbnail}
						/>
					</div>
				),
			},
			{
				Header: id,
				id: "id",
				accessor: (p) => p.id,
				Cell: ({ value }: any) => <div className={styles.cell}>{value}</div>,
			},
			{
				Header: name,
				id: "name",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{value.name}</div>
						<div className={styles.english}>{value.nameEnglish}</div>
					</div>
				),
			},
			{
				Header: type,
				id: "type",
				accessor: (p) => p.imageType,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>{value.name}</div>
						<div className={styles.english}>{value.nameEnglish}</div>
					</div>
				),
			},
			{
				Header: ratings,
				id: "stars",
				accessor: (p) => p,
				Cell: ({ value }: any) => (
					<div className={styles.name}>
						<div className={styles.arabic}>
							{value.imageType.id === 2 && (
								<Rating
									value={value.stars}
									readOnly
									size="large"
								/>
							)}
						</div>
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
				id: "actions",
				accessor: (p) => p,
				// Cell: ({ value }: any) => (
				// 	<div className={language !== "ar" ? styles.action : styles.actionLTR}>
				// 		<div className={styles.btnDiv}>
				// 			<Button onClick={(id) => editClickHandler(value.id)}>
				// 				{edit}
				// 			</Button>
				// 		</div>
				// 		{value.activeStatus !== 1 ? (
				// 			<div className={styles.btnDiv}>
				// 				<Button onClick={(id) => activateClickHandler(value.id)}>
				// 					{activate}
				// 				</Button>
				// 			</div>
				// 		) : (
				// 			<div>
				// 				<Button
				// 					isCritical
				// 					onClick={(id) => deleteClickHandler(value.id)}>
				// 					{deleteBtn}
				// 				</Button>
				// 			</div>
				// 		)}
				// 	</div>
				// ),
				Cell: ({ value }: any) => (
					<ActionButtons
						id={value.id}
						// showView={true}
						// detailPageLink={`${RoutePath.USER}/${value.id}`}
						showActivate={value.activeStatus.id !== 1}
						onActivate={(id) => activateClickHandler(id)}
						showEdit={true}
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
			activateClickHandler,
			deleteClickHandler,
			editClickHandler,
			id,
			language,
			name,
			privileges?.deletePrivilege,
			ratings,
			status,
			type,
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
		// fetchData(currentpage);
	};

	// Dropdown selection handlers
	const pageViewSelectionHandler = (option: DropdownOption) => {
		const size = +option.value;

		setPageSize(size);
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

	return (
		<PageContainer
			displayContent={privileges?.readPrivilege}
			className={styles.imageManagement}
			showAddButton
			btnAddUrlLink={RoutePath.IMAGE_MANAGING_NEW}>
			{/* {privileges?.insertPrivilege && (
				<ShadowedContainer className={styles.section}>
					<RedirectButton
						label={t("button.add", { framework: "React" })}
						redirectTo={RoutePath.HONORS_NEW}
					/>
				</ShadowedContainer>
			)} */}

			<div>
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
					onActiveStatusOptionSelectionChange={statusSelectHandler}
				/>
			</div>
		</PageContainer>
	);
};

export default ImageManagementHomePage;
