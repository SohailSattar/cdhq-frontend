import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getMenuDetails } from "../../../../api/menu/get/getMenuDetails";

import {
	IMenuFormInputs,
	MenuForm,
	PageContainer,
} from "../../../../components";

import {
	APIMenuItemDetail,
	APIUpdateMenuItem,
} from "../../../../api/menu/types";

import { updateMenuItem } from "../../../../api/menu/update/updateMenuItem";

import * as RoutePath from "../../../../RouteConfig";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";

const MenuEditSettingsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [details, setDetails] = useState<APIMenuItemDetail>();

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

	const fetchDetails = useCallback(async () => {
		if (id) {
			const { data } = await getMenuDetails(id!);
			if (data) {
				setDetails(data!);
			}
		}
	}, [id]);

	useEffect(() => {
		// const fetch = async () => {
		// 	if (id) {
		// 		const { data } = await getMenuDetails(id!);
		// 		if (data) {
		// 			setDetails(data!);
		// 		}
		// 	}
		// };

		// fetch();
		fetchDetails();
	}, [fetchDetails]);

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

		const params: APIUpdateMenuItem = {
			id: id!,
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

		const { data, error } = await updateMenuItem(params);
		if (data) {
			toast.success(
				t("message.menuItemUpdated", { framework: "React" }).toString()
			);
			fetchDetails();
		}

		if (error) {
			toast.error(error);
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.updatePrivilege}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<MenuForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default MenuEditSettingsPage;
