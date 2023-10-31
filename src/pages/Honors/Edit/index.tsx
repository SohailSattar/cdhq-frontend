import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { getHonorDetail } from "../../../api/honors/get/getHonorDetail";
import {
	APIHonor,
	APIUpdateHonor,
	APIUpdateHonorImage,
} from "../../../api/honors/types";
import { updateHonorImage } from "../../../api/honors/update/updateHonorImage";
import { toast } from "react-toastify";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { updateHonor } from "../../../api/honors/update/updateHonor";

import * as RoutePath from "../../../RouteConfig";

const HonorEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [honor, setHonor] = useState<APIHonor>();

	const [canView, setCanView] = useState<boolean>();

	const fetch = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(Project.Honors);
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

				if (readPrivilege) {
					const { data } = await getHonorDetail(id!);

					if (data) {
						setHonor(data);
						setCanView(privileges?.updatePrivilege);
					} else {
						// navigate(RoutePath.ROOT);
					}
				} else {
					setCanView(false);
				}
			}
		},
		[id, privileges?.updatePrivilege]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	const honorUpdateClickHandler = async (values: IHonorFormInputs) => {
		const params: APIUpdateHonor = {
			id: id!,
			honorType: +values.honorType.value,
			notes: values.notes,
		};

		const { data, error } = await updateHonor(params);
		if (data) {
			toast.success(
				t("message.honorUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(
				`${t("message.fail", { framework: "React" }).toString()} - ${error}`
			);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateHonorImage = {
			id: id!,
			thumbnail: image,
		};

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
		<PageContainer
			title={t("page.honorEdit", { framework: "React" })}
			displayContent={privileges?.updatePrivilege}
			showBackButton
			btnBackUrlLink={`${RoutePath.HONORS}`}>
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
