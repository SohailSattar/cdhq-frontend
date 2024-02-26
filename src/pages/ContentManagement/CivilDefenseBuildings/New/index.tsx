import { useEffect, useMemo, useState } from "react";
import { getLinkType } from "../../../../api/linkTypes/get/getLinkType";
import {
	CivilDefenseBuildingForm,
	ICivilDefenseBuildingFormInputs,
	ILinkTypeFormInputs,
	LinkTypeForm,
	PageContainer,
} from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	APILinkTypeDetail,
	APIUpdateLinkType,
} from "../../../../api/linkTypes/types";
import { updateLinkTypeDetail } from "../../../../api/linkTypes/update/updateLinkTypeDetail";
import { toast } from "react-toastify";

import * as RoutePath from "../../../../RouteConfig";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";
import { APICreateCivilDefenseBuilding } from "../../../../api/civilDefenseBuildings/types";
import { addCdBuilding } from "../../../../api/civilDefenseBuildings/add/addCdBuilding";

const CDBuildingsNewContentManagementPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [privileges, setPrivileges] = useState<APIPrivileges>();

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

	const submitHandler = async (values: ICivilDefenseBuildingFormInputs) => {
		const {
			name,
			nameEnglish,
			owner,
			constructionYear,
			longitude,
			latitude,
			section,
		} = values;

		const params: APICreateCivilDefenseBuilding = {
			name: name,
			nameEnglish: nameEnglish,
			ownerId: owner?.value,
			constructionYear: constructionYear,
			latitude: latitude ? +latitude : 0,
			longitude: longitude ? +latitude : 0,
			sectionId: section?.value,
		};

		// Update logic
		const { data, error } = await addCdBuilding(params);

		if (data) {
			toast.success(
				t("message.recordCreated", { framework: "React" }).toString()
			);
			navigate(
				`${RoutePath.CONTENT_MANAGEMENT_CD_BUILDING_EDIT.replace(
					RoutePath.ID,
					data.id!.toString()
				)}`
			);
		}

		if (error) {
			toast.error(error);
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.updatePrivilege!}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<CivilDefenseBuildingForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
			{/* <LinkTypeForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
			/> */}
		</PageContainer>
	);
};

export default CDBuildingsNewContentManagementPage;
