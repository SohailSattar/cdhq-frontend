import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { getHonorDetail } from "../../../api/honors/get/getHonorDetail";
import { APIHonorDetail, APIUpdateHonorImage } from "../../../api/honors/types";
import { updateHonorImage } from "../../../api/honors/update/updateHonorImage";
import { toast } from "react-toastify";

const HonorEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [honor, setHonor] = useState<APIHonorDetail>();

	const fetch = useMemo(
		() => async () => {
			const { data } = await getHonorDetail(id!);
			setHonor(data);
		},
		[id]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	const honorUpdateClickHandler = (values: IHonorFormInputs) => {
		console.log(values);
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateHonorImage = {
			id: id!,
			thumbnail: image,
		};

		console.log(params);

		const { data, error } = await updateHonorImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.success(t("message.fail", { framework: "React" }).toString());
		}
	};

	return (
		<PageContainer title="Edit">
			<HonorForm
				data={honor}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={honorUpdateClickHandler}
				onImageUpload={imageUploadHandler}
			/>
		</PageContainer>
	);
};

export default HonorEditPage;
