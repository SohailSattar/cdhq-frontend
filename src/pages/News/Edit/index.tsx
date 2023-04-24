import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import {
	APINewsDetail,
	APIUpdateNews,
	APIUpdateNewsImage
} from "../../../api/news/types";
import { updateNews } from "../../../api/news/update/updateNews";
import { updateNewsImage } from "../../../api/news/update/updateNewsImage";
import { MetaDataDetails, PageContainer } from "../../../components";
import { NewsForm, INewsFormInputs } from "../../../components";
import * as RoutePath from "../../../RouteConfig";

const NewsEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [news, setNews] = useState<APINewsDetail>();

	const fetch = useMemo(
		() => async () => {
			const { data } = await getNewsDetail(id!);
			setNews(data);
		},
		[id]
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
			fullNews: values.fullNews
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
			thumbnail: image
		};

		const { data } = await updateNewsImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}
	};

	return (
		<PageContainer
			title="Edit News"
			showBackButton
			btnBackLabel={t("button.backToDetail", { framework: "React" })}
			btnBackUrlLink={RoutePath.NEWS_DETAIL.replace(":id", id!)}>
			<NewsForm
				data={news}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={editNewsHandler}
				onImageUpload={imageUploadHandler}
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
