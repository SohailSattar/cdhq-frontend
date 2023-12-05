import { useTranslation } from "react-i18next";
import {
	IQRCodeFormInputs,
	PageContainer,
	QRCodeForm,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { APIPrivileges } from "../../../../api/privileges/type";
import { getProjectPrivilege } from "../../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../../data/projects";
import {
	APIQRCodeDetail,
	APIUpdateQRCodeDetail,
	APIUpdateQRCodeIcon,
	APIUpdateQRCodeImage,
} from "../../../../api/qr-codes/types";
import { getQRCodeDetail } from "../../../../api/qr-codes/get/getQRCodeDetail";
import { updateQRCodeDetail } from "../../../../api/qr-codes/update/updateQRCodeDetail";
import { toast } from "react-toastify";
import { updateQRCodeImage } from "../../../../api/qr-codes/update/updateQRCodeImage";
import { updateQRCodeIcon } from "../../../../api/qr-codes/update/updateQRCodeIcon";

const QRCodeEditContentManagementPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [privileges, setPrivileges] = useState<APIPrivileges>();
	const [details, setDetails] = useState<APIQRCodeDetail>();

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

	const fetchDetails = useMemo(
		() => async () => {
			if (id) {
				const { data, error } = await getQRCodeDetail(id!);

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

	const codeUpdateClickHandler = async (values: IQRCodeFormInputs) => {
		const { name, nameEnglish } = values;
		const params: APIUpdateQRCodeDetail = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
		};

		const { data, error } = await updateQRCodeDetail(params);
		if (data) {
			toast.success(
				t("message.recordUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(
				`${t("message.fail", { framework: "React" }).toString()} - ${error}`
			);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateQRCodeImage = {
			id: id!,
			imageFile: image,
		};

		const { data, error } = await updateQRCodeImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(t("message.fail", { framework: "React" }).toString());
		}
	};

	const iconUploadHandler = async (icon: File) => {
		const params: APIUpdateQRCodeIcon = {
			id: id!,
			iconFile: icon,
		};

		const { data, error } = await updateQRCodeIcon(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}

		if (error) {
			toast.error(t("message.fail", { framework: "React" }).toString());
		}
	};

	return (
		<PageContainer
			displayContent={privileges?.updatePrivilege}
			showBackButton
			btnBackUrlLink={RoutePath.CONTENT_MANAGEMENT}>
			<QRCodeForm
				data={details!}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={codeUpdateClickHandler}
				onImageUpload={imageUploadHandler}
				onIconUpload={iconUploadHandler}
			/>
		</PageContainer>
	);
};

export default QRCodeEditContentManagementPage;
