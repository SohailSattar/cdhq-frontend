import { useEffect, useMemo, useState } from "react";
import { getLinkType } from "../../../../api/linkTypes/get/getLinkType";
import {
	ILinkTypeFormInputs,
	LinkTypeForm,
	PageContainer,
} from "../../../../components";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	APILinkTypeDetail,
	APIUpdateLinkType,
} from "../../../../api/linkTypes/types";
import { updateLinkTypeDetail } from "../../../../api/linkTypes/update/updateLinkTypeDetail";
import { toast } from "react-toastify";

import * as RoutePath from "../../../../RouteConfig";

const LinkTypeEditSettingsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [details, setDetails] = useState<APILinkTypeDetail>();

	const fetchDetails = useMemo(
		() => async () => {
			if (id) {
				const { data, error } = await getLinkType(id!);

				if (data) {
					setDetails(data);
				}

				if (error) {
				}
			}
		},
		[id]
	);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	const submitHandler = async (values: ILinkTypeFormInputs) => {
		const { name, nameEnglish, isFile } = values;

		const params: APIUpdateLinkType = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			isFile: isFile,
		};

		// Update logic
		const { data, error } = await updateLinkTypeDetail(params);

		if (data) {
			toast.success(
				t("message.linkTypeUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(error);
		}
	};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.SETTINGS}>
			<LinkTypeForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default LinkTypeEditSettingsPage;
