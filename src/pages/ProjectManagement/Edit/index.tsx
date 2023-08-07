import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProjectDetail } from "../../../api/projects/get/getProjectDetail";
import {
	APIProjectDetail,
	APIUpdateProject,
	APIUpdateProjectStatus,
	APIUpdateProjectThumbnail,
} from "../../../api/projects/types";
import { updateProject } from "../../../api/projects/update/updateProject";
import { updateProjectThumbnail } from "../../../api/projects/update/updateProjectThumbnail";
import {
	PageContainer,
	ProjectForm,
	IProjectFormInputs,
	MetaDataDetails,
	DeleteConfirmation,
	Status,
} from "../../../components";

import * as RoutePath from "../../../RouteConfig";
import { updateProjectStatus } from "../../../api/projects/update/updateProjectStatus";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { useStore } from "../../../utils/store";
import { ROLE } from "../../../utils";

const ProjectEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const loggedInUser = useStore((state) => state.loggedInUser);

	const [showModal, setShowModal] = useState(false);

	const [project, setProject] = useState<APIProjectDetail>();
	const [status, setStatus] = useState<APIActiveStatus>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getProjectDetail(id!);
			setProject(data);

			setStatus(data?.activeStatus);
		};

		if (id) {
			if (loggedInUser.role !== ROLE.SUPERADMIN) {
				navigate(RoutePath.PROJECT_DETAIL.replace(RoutePath.ID, id));
			}

			fetch();
		}
	}, [id]);

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateProjectThumbnail = {
			id: id!,
			thumbnail: image,
		};

		const { data } = await updateProjectThumbnail(params);

		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
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

	const submitHandler = async (values: IProjectFormInputs) => {
		const {
			name,
			nameEnglish,
			parentProject,
			projectGroup,
			departmentCategory,
			withAcademy,
			hasWorkflow,
			pathLink,
			isExternalPath,
			displayOnDashboard,
		} = values;

		const params: APIUpdateProject = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			parentId: parentProject?.value!,
			// parentProject?.value !== "" ? +parentProject?.value! : undefined,
			projectGroupId: +projectGroup?.value!,
			departmentCategoryId: +departmentCategory?.value!,
			withAcademy: withAcademy,
			hasWorkflow: hasWorkflow,
			pathLink: pathLink,
			isExternalPath: isExternalPath,
			isActive: displayOnDashboard,
		};

		const { data } = await updateProject(params);
		if (data) {
			toast.success(
				t("message.projectUpdated", { framework: "React" }).toString()
			);
		}
	};

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			title={t("page.projectEdit", { framework: "React" })}
			showBackButton
			btnBackLabel={t("button.backToDetail", { framework: "React" }).toString()}
			btnBackUrlLink={RoutePath.PROJECT_DETAIL.replace(RoutePath.ID, id!)}
			showChangeStatusButton
			currentStatus={status?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			onActivate={activateButtonClickHandler}
			onDectivate={deleteButtonClickHandler}>
			{/* <Status status={status!} /> */}
			<ProjectForm
				data={project}
				onSubmit={submitHandler}
				onImageUpload={imageUploadHandler}
				actionButtonText={t("button.update", { framework: "React" }).toString()}
			/>
			<hr />
			<MetaDataDetails
				createdBy={project?.createdBy!}
				createdOn={project?.createdOn!}
				updatedBy={project?.updatedBy}
				updatedOn={project?.updatedOn}
			/>
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default ProjectEditPage;
