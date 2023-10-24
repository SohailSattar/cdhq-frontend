import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { useEffect, useMemo, useState } from "react";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { addHonor } from "../../../api/honors/add/addHonor";
import { APINewHonor } from "../../../api/honors/types";

import * as RoutePath from "../../../RouteConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HonorNewPage = () => {
	const [t] = useTranslation("common");
	const [canView, setCanView] = useState<boolean>();

	const navigate = useNavigate();

	const fetchDetails = useMemo(
		() => async () => {
			// check if user can get details
			const { data: privilege } = await getProjectPrivilege(Project.Honors);

			if (!privilege?.insertPrivilege) {
				setCanView(false);
				return;
			} else {
				setCanView(true);
			}

			// get the details.
		},
		[]
	);

	useEffect(() => {
		// if (
		// 	(role === ROLE.USER || role === "" || role === ROLE.ADMIN) &&
		// 	(loggedUserId.toString() !== id || loggedUserId === 0)
		// ) {
		// 	navigate(RoutePath.USER);
		// } else {
		// 	setCanView(true);
		// }
		fetchDetails();
	}, [fetchDetails]);

	const submitHandler = async (values: IHonorFormInputs) => {
		const { employeeId, honorType, thumbnail } = values;
		const params: APINewHonor = {
			employeeId: employeeId,
			honorType: +honorType.value,
			thumbnail: thumbnail,
		};
		const { data, error } = await addHonor(params);
		if (data?.success) {
			toast.success(
				t("message.honorCreated", { framework: "React" }).toString()
			);
			navigate(
				RoutePath.HONORS_EDIT.replace(RoutePath.ID, data?.id!.toString())
			);
		} else {
			toast.error(error?.ErrorMessage);
		}
	};

	return (
		<PageContainer
			displayContent={canView}
			showBackButton
			btnBackUrlLink={RoutePath.HONORS}>
			<HonorForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default HonorNewPage;
