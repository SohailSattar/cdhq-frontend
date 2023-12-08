import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
	IMenuFormInputs,
	MenuForm,
	PageContainer,
} from "../../../../components";

import { APINewMenuItem } from "../../../../api/menu/types";
import { addMenuItem } from "../../../../api/menu/add/addMenuitem";
import { useNavigate } from "react-router-dom";

import * as RoutePath from "../../../../RouteConfig";
import { useState, useMemo, useEffect } from "react";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";

const MenuNewSettingsPage = () => {
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

	const submitHandler = async (values: IMenuFormInputs) => {
		const {
			name,
			nameEnglish,
			parentProject,
			linkPath,
			isVisible,
			orderNo,
			menuType,
			linkType,
			file,
			isExternalLink,
		} = values;

		const parentId =
			parentProject?.value! !== "" ? +parentProject?.value! : undefined;

		const orderNum = orderNo !== "" ? +orderNo : undefined;

		const menuTypeId = menuType?.value;
		const linkTypeId = linkType?.value;

		const params: APINewMenuItem = {
			name: name,
			nameEnglish: nameEnglish,
			parentId: parentId,
			linkPath: linkPath,
			isVisible: isVisible,
			orderNo: orderNum,
			menuTypeId: menuTypeId,
			linkTypeId: linkTypeId,
			file: file,
			isExternalPath: isExternalLink!,
		};

		const { data, error } = await addMenuItem(params);

		if (data?.success) {
			toast.success(
				t("message.menuItemAdded", { framework: "React" }).toString()
			);
			navigate(RoutePath.CONTENT_MANAGEMENT);
		}

		if (error) {
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.insertPrivilege}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<MenuForm
				actionButtonText={t("button.add", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default MenuNewSettingsPage;
