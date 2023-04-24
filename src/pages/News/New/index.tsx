import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { addNews } from "../../../api/news/add/addNews";
import { APINewNews } from "../../../api/news/types";
import { NewsForm, INewsFormInputs } from "../../../components";
import { PageContainer } from "../../../components";

import * as RoutePath from "../..//../RouteConfig";

const NewsCreatePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const addNewsHandler = async (values: INewsFormInputs) => {
		const params: APINewNews = {
			departmentId: values.department.value!,
			title: values.title!,
			shortSummary: values.shortSummary,
			thumbnail: values.thumbnail,
			newsTypeId: +values.newsType.value!,
			fullNews: values.fullNews
		};

		const { data } = await addNews(params);
		if (data) {
			toast.success(t("message.newsAdded", { framework: "React" }).toString());
			navigate(`${RoutePath.NEWS}/${data.id}`);
		}
	};

	return (
		<PageContainer
			title="Create News"
			showBackButton
			btnBackUrlLink={RoutePath.NEWS}
		>
			<NewsForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={addNewsHandler}
			/>
		</PageContainer>
	);
};

export default NewsCreatePage;
