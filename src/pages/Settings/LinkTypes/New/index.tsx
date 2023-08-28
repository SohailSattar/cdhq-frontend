import { useTranslation } from "react-i18next";
import {
	ILinkTypeFormInputs,
	LinkTypeForm,
	PageContainer,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";
import { useNavigate } from "react-router-dom";

const LinkTypeNewSettingsPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const submitHandler = async (values: ILinkTypeFormInputs) => {};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.SETTINGS}>
			<LinkTypeForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default LinkTypeNewSettingsPage;
