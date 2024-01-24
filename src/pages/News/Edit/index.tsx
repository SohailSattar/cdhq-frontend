import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import {
	APINewsDetail,
	APIUpdateNews,
	APIUpdateNewsImage,
	APIUpdateNewsVideo,
} from "../../../api/news/types";
import { updateNews } from "../../../api/news/update/updateNews";
import { updateNewsImage } from "../../../api/news/update/updateNewsImage";
import { MetaDataDetails, PageContainer } from "../../../components";
import { NewsForm, INewsFormInputs } from "../../../components";
import * as RoutePath from "../../../RouteConfig";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";
import { updateNewsVideo } from "../../../api/news/update/updateNewsVideo";

const NewsEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [news, setNews] = useState<APINewsDetail>();
	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [serverErrors, setServerErrors] = useState<string[]>([]);

	const fetch = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(Project.News);
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
					const { data } = await getNewsDetail(id!);
					setNews(data);
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

	const editNewsHandler = async (values: INewsFormInputs) => {
		const params: APIUpdateNews = {
			id: id!,
			departmentId: values.department.value,
			title: values.title,
			shortSummary: values.shortSummary,
			newsTypeId: +values.newsType!.value,
			// thumbnail: values.thumbnail,
			fullNews: values.fullNews,
		};

		const { data, error } = await updateNews(params);

		if (data?.success) {
			toast.success(
				t("message.newsUpdated", { framework: "React" }).toString()
			);
		} else {
			toast.error(error?.ErrorMessage);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateNewsImage = {
			id: id!,
			thumbnail: image,
		};

		const { data } = await updateNewsImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}
	};
	const videoUploadHandler = async (video: File) => {
		const params: APIUpdateNewsVideo = {
			id: id!,
			videoFile: video,
		};

		const { data, error } = await updateNewsVideo(params);
		if (data) {
			toast.success(
				t("message.videoUpdated", { framework: "React" }).toString()
			);
		}
		if (error) {
			setServerErrors(error);
		}
	};

	return (
		<PageContainer
			title={t("page.newsEdit", { framework: "React" })}

			// showBackButton
			// btnBackLabel={t("button.backToDetail", { framework: "React" })}
			// btnBackUrlLink={RoutePath.NEWS_DETAIL.replace(":id", id!)}
		>
			<NewsForm
				data={news}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={editNewsHandler}
				onImageUpload={imageUploadHandler}
				onVideoUpload={videoUploadHandler}
				serverErrors={serverErrors}
			/>
			<hr />
			<MetaDataDetails
				createdBy={news?.createdBy!}
				createdOn={news?.createdOn!}
				updatedBy={news?.updatedBy!}
				updatedOn={news?.updatedOn!}
			/>
		</PageContainer>
	);
};

export default NewsEditPage;
