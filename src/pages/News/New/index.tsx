import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { addNews } from "../../../api/news/add/addNews";
import { APINewNews } from "../../../api/news/types";
import {
	NewsForm,
	INewsFormInputs,
	Modal,
	ProjectPreview,
	NewsPreview,
} from "../../../components";
import { PageContainer } from "../../../components";

import * as RoutePath from "../..//../RouteConfig";
import { useEffect, useState } from "react";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const NewsCreatePage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [details, setDetails] = useState<INewsFormInputs>();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [privileges, setPrivileges] = useState<APIPrivileges>();

	useEffect(() => {
		const fetch = async () => {
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

				if (privilege?.insertPrivilege! !== false) {
				} else {
					const url = RoutePath.NEWS;
					navigate(url);
				}
			}
		};

		fetch();
	}, [navigate, setPrivileges]);

	const previewHandler = async (values: INewsFormInputs) => {
		setDetails(values);
		setIsOpen(true);
	};

	const addNewsHandler = async () => {
		setIsOpen(false);

		const { department, newsType, thumbnail, title, shortSummary, fullNews } =
			details!;

		const params: APINewNews = {
			departmentId: department.value!,
			title: title!,
			shortSummary: shortSummary,
			thumbnail: thumbnail,
			newsTypeId: +newsType.value!,
			fullNews: fullNews,
		};

		const { data, error } = await addNews(params);
		if (error) {
			toast.error(error.ErrorMessage);
		}

		if (data) {
			toast.success(t("message.newsAdded", { framework: "React" }).toString());
			navigate(`${RoutePath.NEWS}/${data.id}`);
		}
	};

	return (
		<PageContainer
			title={t("page.newsCreate", { framework: "React" })}
			showBackButton
			btnBackUrlLink={RoutePath.NEWS}>
			<NewsForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={previewHandler}
			/>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<NewsPreview
					data={details!}
					onClick={addNewsHandler}
					onCancel={() => setIsOpen(false)}
				/>
			</Modal>
		</PageContainer>
	);
};

export default NewsCreatePage;
