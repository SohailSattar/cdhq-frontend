import { useNavigate, useParams } from "react-router-dom";
import {
	IImageFormInputs,
	ImageForm,
	PageContainer,
} from "../../../../components";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../utils/store";

import * as RoutePath from "../../../../RouteConfig";
import { APINewImage } from "../../../../api/images/types";
import { addImage } from "../../../../api/images/add/addImage";
import { toast } from "react-toastify";
import { useState } from "react";

const ImageNewPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const language = useStore((state) => state.language);
	const [serverErrors, setServerErrors] = useState<string[]>([]);

	const submitFormHandler = async (values: IImageFormInputs) => {
		const { name, nameEnglish, imageType, thumbnail, stars, videoFile } =
			values;

		const params: APINewImage = {
			name: name,
			nameEnglish: nameEnglish,
			imageTypeId: imageType.value,
			stars: +stars! || 0,
			thumbnail: thumbnail,
			videoFile: videoFile,
		};

		const { data, error } = await addImage(params);
		if (data?.success) {
			toast.success(
				t("message.imageCreated", { framework: "React" }).toString()
			);
			navigate(
				RoutePath.CONTENT_MANAGEMENT_IMAGE_EDIT.replace(
					RoutePath.ID,
					data?.id!.toString()
				)
			);
		} else {
			toast.error(error?.ErrorMessage);
		}

		if (error) {
		}
	};

	return (
		<PageContainer
			title={t("page.imageNew", { framework: "React" })}
			showBackButton
			btnBackLabel={t("button.backToHome", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.CONTENT_MANAGEMENT}`}>
			<ImageForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitFormHandler}
			/>
		</PageContainer>
	);
};

export default ImageNewPage;
