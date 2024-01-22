import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	DeleteConfirmation,
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { getHonorDetail } from "../../../api/honors/get/getHonorDetail";
import {
	APIHonor,
	APIUpdateHonor,
	APIUpdateHonorImage,
} from "../../../api/honors/types";
import { updateHonorImage } from "../../../api/honors/update/updateHonorImage";
import { toast } from "react-toastify";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { updateHonor } from "../../../api/honors/update/updateHonor";

import * as RoutePath from "../../../RouteConfig";
import { APIStatus } from "../../../api";
import { updateHonorStatus } from "../../../api/honors/update/updateHonorStatus";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";

const HonorEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [t] = useTranslation("common");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [honor, setHonor] = useState<APIHonor>();

	const [canView, setCanView] = useState<boolean>();
	const [status, setStatus] = useState<APIActiveStatus>();
	const [showModal, setShowModal] = useState(false);

	const fetch = useMemo(
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

				if (readPrivilege) {
					const { data } = await getHonorDetail(id!);

					if (data) {
						setHonor(data);
						setCanView(privileges?.updatePrivilege);
					} else {
						// navigate(RoutePath.ROOT);
					}
				} else {
					setCanView(false);
				}
			}
		},
		[id, privileges?.updatePrivilege]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	const honorUpdateClickHandler = async (values: IHonorFormInputs) => {
		const params: APIUpdateHonor = {
			id: id!,
			honorType: +values.honorType.value,
			notes: values.notes,
		};

		const { data, error } = await updateHonor(params);
		if (data) {
			toast.success(
				t("message.honorUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(
				`${t("message.fail", { framework: "React" }).toString()} - ${error}`
			);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateHonorImage = {
			id: id!,
			thumbnail: image,
		};

		const { data, error } = await updateHonorImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.success(t("message.fail", { framework: "React" }).toString());
		}
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 9;

		const params: APIStatus = {
			id: id!,
			activeStatusId: 9,
		};

		const { data, error } = await updateHonorStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}
		}

		toast.error(
			t("message.honorDeactivated", { framework: "React" }).toString()
		);
		setShowModal(false);
		navigate(`${RoutePath.HONORS}`);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<PageContainer
			title={t("page.honorEdit", { framework: "React" })}
			displayContent={privileges?.updatePrivilege}
			showBackButton
			btnBackUrlLink={`${RoutePath.HONORS}`}
			showChangeStatusButton={
				privileges?.privilegeId !== 999 && privileges?.updatePrivilege
			}
			currentStatus={
				"ACTIVE"
				// status?.id === 1 ? "ACTIVE" : "DEACTIVE"
			}
			onDectivate={deleteButtonClickHandler}>
			<HonorForm
				data={honor}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={honorUpdateClickHandler}
				onImageUpload={imageUploadHandler}
			/>{" "}
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default HonorEditPage;
