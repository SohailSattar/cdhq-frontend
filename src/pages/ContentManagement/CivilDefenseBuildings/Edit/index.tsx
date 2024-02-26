import { useEffect, useMemo, useState } from "react";
import { getLinkType } from "../../../../api/linkTypes/get/getLinkType";
import {
	CivilDefenseBuildingForm,
	DeleteConfirmation,
	ICivilDefenseBuildingFormInputs,
	ILinkTypeFormInputs,
	LinkTypeForm,
	MetaDataDetails,
	PageContainer,
} from "../../../../components";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APIUpdateLinkType } from "../../../../api/linkTypes/types";
import { updateLinkTypeDetail } from "../../../../api/linkTypes/update/updateLinkTypeDetail";
import { toast } from "react-toastify";

import * as RoutePath from "../../../../RouteConfig";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";
import { getCdBuilding } from "../../../../api/civilDefenseBuildings/get/getCdBuilding";
import {
	APICivilDefenseBuildingDetail,
	APIUpdateCivilDefenseBuilding,
	APIUpdateCivilDefenseBuildingStatus,
} from "../../../../api/civilDefenseBuildings/types";
import { updateCdBuilding } from "../../../../api/civilDefenseBuildings/update/updateCdBuilding";
import { getActiveStatus } from "../../../../api/activeStatus/get/getActiveStatus";
import { updateCdBuildingStatus } from "../../../../api/civilDefenseBuildings/update/updateCdBuildingStatus";
import { APIActiveStatus } from "../../../../api/activeStatus/types";

const CDBuildingsEditContentManagementPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [showModal, setShowModal] = useState(false);

	const [errors, setErrors] = useState<string[]>([]);

	const [privileges, setPrivileges] = useState<APIPrivileges>();
	const [details, setDetails] = useState<APICivilDefenseBuildingDetail>();
	const [status, setStatus] = useState<APIActiveStatus>();

	const checkPrivilege = useMemo(
		() => async () => {
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
		},
		[]
	);

	useEffect(() => {
		checkPrivilege();
	}, [checkPrivilege]);

	const fetchDetails = useMemo(
		() => async () => {
			if (id) {
				const { data, error } = await getCdBuilding(id!);

				if (data) {
					setDetails(data);
					setStatus(data.activeStatus);
				}

				if (error) {
				}
			}
		},
		[id]
	);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	const submitHandler = async (values: ICivilDefenseBuildingFormInputs) => {
		const {
			name,
			nameEnglish,
			owner,
			constructionYear,
			latitude,
			longitude,
			section,
		} = values;

		const params: APIUpdateCivilDefenseBuilding = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			ownerId: owner?.value,
			constructionYear: constructionYear,
			latitude: latitude ? +latitude : 0,
			longitude: longitude ? +latitude : 0,
			sectionId: section?.value,
		};

		// Update logic
		const { data, error } = await updateCdBuilding(params);

		if (data) {
			if (data.success === false) {
				setErrors(data.errors!);
			} else {
				// const { data: status } = await getActiveStatus(9);
				// if (status) {
				// 	setStatus(status);
				// }
				// toast.success(
				// 	t("message.departmentDeactivated", { framework: "React" }).toString()
				// );

				toast.success(
					t("message.recordUpdated", { framework: "React" }).toString()
				);
			}
		}

		if (error) {
			setErrors([error.ErrorMessage!]);
			toast.error(error.ErrorMessage!);
		}
	};

	const activateButtonClickHandler = async () => {
		const statusCode = 1;

		const params: APIUpdateCivilDefenseBuildingStatus = {
			id: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateCdBuildingStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(
			t("message.recordActivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 9;

		const params: APIUpdateCivilDefenseBuildingStatus = {
			id: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateCdBuildingStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(
			t("message.recordDeactivated", { framework: "React" }).toString()
		);
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<PageContainer
			displayContent={privileges?.updatePrivilege!}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}
			showChangeStatusButton
			currentStatus={status?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			onActivate={activateButtonClickHandler}
			onDectivate={deleteButtonClickHandler}
			errors={errors}>
			<CivilDefenseBuildingForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
			/>
			<MetaDataDetails
				createdBy={details?.createdBy!}
				createdOn={details?.createdOn!}
				updatedBy={details?.updatedBy!}
				updatedOn={details?.updatedOn!}
			/>{" "}
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default CDBuildingsEditContentManagementPage;
