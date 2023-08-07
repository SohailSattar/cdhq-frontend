import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	AllocatedUsers,
	Button,
	DeleteConfirmation,
	MetaDataDetails,
	PageContainer,
	ProjectDetail,
	ProjectTree,
	RedirectButton,
	ShadowedContainer,
	Status,
} from "../../../components";

import {
	APIProjectDetail,
	APIUpdateProjectStatus,
} from "../../../api/projects/types";
import { getProjectDetail } from "../../../api/projects/get/getProjectDetail";
import { useStore } from "../../../utils/store";
import { toast } from "react-toastify";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { useTranslation } from "react-i18next";
import { updateProjectStatus } from "../../../api/projects/update/updateProjectStatus";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { ROLE } from "../../../utils";

const ProjectDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const { role } = useStore((state) => state.loggedInUser);

	const [showModal, setShowModal] = useState(false);

	const [project, setProject] = useState<APIProjectDetail>();
	const [status, setStatus] = useState<APIActiveStatus>();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getProjectDetail(id!);

			console.log(data);

			if (!data) {
				navigate(RoutePath.PROJECT);
			}
			setProject(data);
			setStatus(data?.activeStatus);
		};

		if (role === ROLE.USER) {
			navigate(RoutePath.HOME);
		}

		fetchData();
	}, [id, navigate, role]);

	const projectTreeNodeClickHandler = (e: any) => {
		const { id } = e;
		if (id !== 0) {
			navigate(`${RoutePath.PROJECT}/${id}`);
		}
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const activateButtonClickHandler = async () => {
		const statusCode = 1;

		const params: APIUpdateProjectStatus = {
			id: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateProjectStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(
			t("message.projectActivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 8;

		const params: APIUpdateProjectStatus = {
			id: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateProjectStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}
		}

		toast.error(
			t("message.projectDeactivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<PageContainer
			title={t("page.projectDetail", { framework: "React" })}
			showBackButton
			btnBackUrlLink={RoutePath.PROJECT}
			lockFor={[ROLE.USER, ROLE.ADMIN]}>
			<div className={styles.project}>
				<div>
					<ProjectTree onNodeClick={projectTreeNodeClickHandler} />
				</div>
				<div className={styles.detail}>
					{role === ROLE.SUPERADMIN && (
						<ShadowedContainer className={styles.btnSection}>
							<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								<RedirectButton
									label={t("button.edit", { framework: "React" })}
									redirectTo={`${RoutePath.PROJECT_EDIT.replace(
										RoutePath.ID,
										id!
									)}`}
								/>
							</div>
							{/* <div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								{status?.id === 1 ? (
									<Button
										onClick={deleteButtonClickHandler}
										isCritical>
										{t("button.deactivate", { framework: "React" })}
									</Button>
								) : (
									<Button onClick={activateButtonClickHandler}>
										{t("button.activate", { framework: "React" })}
									</Button>
								)}
							</div> */}
						</ShadowedContainer>
					)}

					<div>
						<Status status={status!} />
					</div>
					<ProjectDetail
						imageSrc={project?.iconName}
						name={project?.name!}
						nameEnglish={project?.nameEnglish!}
						groupName={project?.group?.nameArabic!}
						groupNameEnglish={project?.group?.nameEnglish!}
					/>
					{/* <AllocatedUsers projectId={id!} /> */}
					<hr />
					<MetaDataDetails
						createdBy={project?.createdBy!}
						createdOn={project?.createdOn!}
						updatedBy={project?.updatedBy!}
						updatedOn={project?.updatedOn!}
					/>

					<DeleteConfirmation
						isOpen={showModal}
						onYesClick={deleteConfirmationClickHandler}
						onCancelClick={deleteCancelHandler}
					/>
				</div>
			</div>
		</PageContainer>
	);
};

export default ProjectDetailPage;
