import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import { APINewsDetail, APIUpdateNews } from "../../../api/news/types";
import { updateNews } from "../../../api/news/update/updateNews";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { NotAuthorized } from "../../../components";
import NewsForm from "../../../components/Form/NewsForm";
import { INewsFormInputs } from "../../../components/Form/types";
import { Project } from "../../../data/projects";

const EditNewsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [canView, setCanView] = useState<boolean>(false);

	const [news, setNews] = useState<APINewsDetail>();

	const fetch = useMemo(
		() => async () => {
			const { data } = await getNewsDetail(id!);
			setNews(data);
		},
		[]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id]);

	const editNewsHandler = async (values: INewsFormInputs) => {
		const params: APIUpdateNews = {
			id: id!,
			title: values.title,
			shortSummary: values.shortSummary,
			newsTypeId: +values.newsType!.value,
			thumbnail: values.thumbnail,
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

	return (
		<div>
			<NewsForm data={news} onSubmit={editNewsHandler} />
		</div>
	);
};

export default EditNewsPage;
