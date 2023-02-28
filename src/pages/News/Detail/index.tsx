import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetail } from "../../../api/news/get/getNewsDetail";
import { APINewsDetail } from "../../../api/news/types";
import { ShadowedContainer } from "../../../components";
import NewsContent from "./containers/Content";
import NewsHeading from "./containers/Heading";
import NewsMeta from "./containers/Meta";

import styles from "./styles.module.scss";

const NewsDetailPage = () => {
	const { id } = useParams<{ id: string }>();

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
		<div className={styles.detail}>
			<ShadowedContainer className={styles.container}>
				<NewsHeading title={detail?.title!} />
			</ShadowedContainer>
			<div className={styles.container}>
				<NewsMeta postedDate={new Date(detail?.newsDate!).toDateString()} />
			</div>
			<ShadowedContainer className={styles.container}>
				<NewsContent data={detail?.fullNews!} />
			</ShadowedContainer>
		</div>
	);
};
export default NewsDetailPage;
