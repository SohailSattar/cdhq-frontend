import { useTranslation } from "react-i18next";
import {
	IQRCodeFormInputs,
	PageContainer,
	QRCodeForm,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";
import { useState, useMemo, useEffect } from "react";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";
import { APINewQRCode } from "../../../../api/qr-codes/types";
import { addQRCode } from "../../../../api/qr-codes/add/addQRCode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const QRCodeNewContentManagementPage = () => {
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

	const submitHandler = async (values: IQRCodeFormInputs) => {
		const { name, nameEnglish, image, icon } = values;
		const params: APINewQRCode = {
			name: name,
			nameEnglish: nameEnglish,
			image: image,
			icon: icon,
		};
		const { data, error } = await addQRCode(params);
		if (data?.success) {
			toast.success(
				t("message.recordCreated", { framework: "React" }).toString()
			);
			// navigate(				RoutePath.HONORS_EDIT.replace(RoutePath.ID, data?.id!.toString()));
			navigate(RoutePath.CONTENT_MANAGEMENT);
		} else {
			toast.error(error?.ErrorMessage);
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.insertPrivilege}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<QRCodeForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default QRCodeNewContentManagementPage;
