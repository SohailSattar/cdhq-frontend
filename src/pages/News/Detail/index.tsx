import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import { APINewsDetail } from "../../../api/news/types";
import { PageContainer, ShadowedContainer } from "../../../components";
import NewsContent from "./containers/Content";
import NewsHeading from "./containers/Heading";
import NewsMeta from "./containers/Meta";

import * as RoutePath from "../../../RouteConfig";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";

const NewsDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const loggedInUser = useStore((state) => state.loggedInUser);

	const [detail, setDetail] = useState<APINewsDetail>();

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getNewsDetail(id!);

			if (data) {
				setDetail(data);
				// setStatus(data.activeStatus);
			} else {
				// navigate(RoutePath.USER);
			}
		};

		fetchData();
	}, [id]);

	return (
		<PageContainer
			showBackButton={loggedInUser.id !== 0}
			btnBackUrlLink={RoutePath.NEWS}
			className={styles.detail}
		>
			<ShadowedContainer className={styles.container}>
				<NewsHeading title={detail?.title!} />
			</ShadowedContainer>
			<div className={styles.container}>
				<NewsMeta postedDate={new Date(detail?.newsDate!).toDateString()} />
			</div>
			<ShadowedContainer className={styles.container}>
				<NewsContent imagePath={detail?.imageName} data={detail?.fullNews!} />
			</ShadowedContainer>
		</PageContainer>
	);
};
export default NewsDetailPage;
