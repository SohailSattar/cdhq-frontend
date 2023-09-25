import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import { APINewsDetail } from "../../../api/news/types";
import {
	NewsContent,
	NewsHeading,
	NewsMeta,
	PageContainer,
	ShadowedContainer,
} from "../../../components";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const NewsDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const loggedInUser = useStore((state) => state.loggedInUser);

	const [detail, setDetail] = useState<APINewsDetail>();

	const [canGoBack, setCanGoBack] = useState<boolean>();

	const checkPrivilege = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(Project.News);

			if (privilege) {
				const { readPrivilege } = privilege;

				setCanGoBack(readPrivilege);
			}
		},
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getNewsDetail(id!);

			if (data) {
				checkPrivilege();
				setDetail(data);
			} else {
			}
		};

		fetchData();
	}, [checkPrivilege, id]);

	return (
		<PageContainer
			// showBackButton={loggedInUser.id !== 0 && canGoBack}
			// btnBackUrlLink={RoutePath.NEWS}
			className={styles.detail}>
			<ShadowedContainer className={styles.container}>
				<NewsHeading title={detail?.title!} />
			</ShadowedContainer>
			<div className={styles.container}>
				<NewsMeta postedDate={new Date(detail?.newsDate!).toDateString()} />
			</div>
			<ShadowedContainer className={styles.container}>
				<NewsContent
					imagePath={detail?.imageName}
					data={detail?.fullNews!}
				/>
			</ShadowedContainer>
		</PageContainer>
	);
};
export default NewsDetailPage;
