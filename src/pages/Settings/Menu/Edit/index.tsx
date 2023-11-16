import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
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

const MenuEditSettingsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [details, setDetails] = useState<APIMenuItemDetail>();

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
			linkType,
			file,
			isExternalLink,
		} = values;

		const parentId =
			parentProject?.value! !== "" ? +parentProject?.value! : undefined;

		const orderNum = orderNo !== "" ? +orderNo : undefined;

		const linkTypeId = linkType?.value;

		const params: APIUpdateMenuItem = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			parentId: parentId,
			linkPath: linkPath,
			isVisible: isVisible,
			orderNo: orderNum,
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
			showBackButton
			btnBackUrlLink={RoutePath.SETTINGS}>
			<MenuForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default MenuEditSettingsPage;
