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

const MenuNewSettingsPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

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

		const params: APINewMenuItem = {
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

		const { data, error } = await addMenuItem(params);

		if (data) {
			toast.success(
				t("message.menuItemAdded", { framework: "React" }).toString()
			);
			navigate(RoutePath.SETTINGS);
		}

		if (error) {
		}
	};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.SETTINGS}>
			<MenuForm
				actionButtonText={t("button.add", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default MenuNewSettingsPage;
