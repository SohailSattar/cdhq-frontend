import { useTranslation } from "react-i18next";
import {
	ILinkTypeFormInputs,
	LinkTypeForm,
	PageContainer,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";
import { useNavigate } from "react-router-dom";
import { APIPrivileges } from "../../../../api/privileges/type";
import { useEffect, useMemo, useState } from "react";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";

const LinkTypeNewSettingsPage = () => {
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

	const submitHandler = async (values: ILinkTypeFormInputs) => {};

	return (
		<PageContainer
			displayContent={privileges?.insertPrivilege!}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<LinkTypeForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default LinkTypeNewSettingsPage;
