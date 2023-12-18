import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	IImageFormInputs,
	ImageForm,
	PageContainer,
} from "../../../../components";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../utils/store";

import * as RoutePath from "../../../../RouteConfig";
import { useEffect, useMemo, useState } from "react";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { getImageDetail } from "../../../../api/images/get/getImageDetail";
import { Project } from "../../../../data/projects";
import {
	APIImageDetail,
	APIUpdateImage,
	APIUpdateImageDetail,
} from "../../../../api/images/types";
import { APIPrivileges } from "../../../../api/privileges/type";
import { updateImageDetail } from "../../../../api/images/update/updateImageDetail";
import { ROLE } from "../../../../utils";
import { updateImage } from "../../../../api/images/update/updateImage";

const ImageEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const language = useStore((state) => state.language);

	const [privileges, setPrivileges] = useState<APIPrivileges>();
	const [imageDetail, setImageDetail] = useState<APIImageDetail>();

	// check if authorized to access
	useEffect(() => {
		const fetch = async () => {
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
		};

		fetch();
	}, [setPrivileges]);

	const fetch = useMemo(
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

				if (privilege?.updatePrivilege! !== false) {
					const { data } = await getImageDetail(id!);
					setImageDetail(data);
				} else {
					const url = RoutePath.NEWS_DETAIL.replace(
						RoutePath.ID,
						id?.toString()!
					);
					navigate(url);
				}
			}
		},
		[id, navigate]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	const submitHandler = async (values: IImageFormInputs) => {
		const { name, nameEnglish, imageType, stars } = values;
		const params: APIUpdateImageDetail = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			imageTypeId: imageType.value!,
			stars: +stars! || 0,
		};

		const { data, error } = await updateImageDetail(params);

		if (data?.success) {
			toast.success(
				t("message.recordUpdated", { framework: "React" }).toString()
			);
		} else {
			toast.error(error?.ErrorMessage);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateImage = {
			id: id!,
			thumbnail: image,
		};

		const { data } = await updateImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}
	};

	return (
		<PageContainer
			title={t("page.imageEdit", { framework: "React" })}
			showBackButton
			btnBackLabel={t("button.backToHome", { framework: "React" })}
			btnBackUrlLink={`${RoutePath.CONTENT_MANAGEMENT_IMAGE}`}>
			<ImageForm
				data={imageDetail}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={submitHandler}
				onImageUpload={imageUploadHandler}
			/>
		</PageContainer>
	);
};

export default ImageEditPage;
