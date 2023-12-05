import { FC, useEffect, useMemo, useState } from "react";
import { PageContainer, QRCodesTable } from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";
import { Id } from "../../../../utils";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";
import { useNavigate } from "react-router-dom";

interface Props {}

const QRCodeHomeContentManagementPage: FC<Props> = () => {
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

	return (
		<PageContainer
			btnAddUrlLink={RoutePath.CONTENT_MANAGEMENT_QR_CODE_NEW}
			showAddButton>
			<QRCodesTable
				canEdit={privileges?.updatePrivilege!}
				canDelete={privileges?.deletePrivilege!}
			/>
		</PageContainer>
	);
};

export default QRCodeHomeContentManagementPage;
