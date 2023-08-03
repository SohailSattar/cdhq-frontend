import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
	IMenuFormInputs,
	MenuForm,
	PageContainer,
} from "../../../../components";
import { useEffect, useState } from "react";
import { getMenuDetails } from "../../../../api/menu/get/getMenuDetails";
import {
	APIMenuItemDetail,
	APIUpdateMenuItem,
} from "../../../../api/menu/types";
import { useParams } from "react-router-dom";
import { updateMenuItem } from "../../../../api/menu/update/updateMenuItem";

import * as RoutePath from "../../../../RouteConfig";

const MenuEditSettingsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [details, setDetails] = useState<APIMenuItemDetail>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMenuDetails(id!);
			if (data) {
				setDetails(data!);
				console.log(data);
			}
		};

		fetch();
	}, [id]);

	const submitHandler = async (values: IMenuFormInputs) => {
		const { name, nameEnglish, parentProject, linkPath, isVisible } = values;

		const params: APIUpdateMenuItem = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			parentId: parentProject?.value!,
			linkPath: linkPath,
			isVisible: isVisible,
		};

		const { data } = await updateMenuItem(params);
		if (data) {
			toast.success(
				t("message.menuItemUpdate", { framework: "React" }).toString()
			);
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
