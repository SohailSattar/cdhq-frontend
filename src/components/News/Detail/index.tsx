import { FC } from "react";
import { NewsContent, NewsHeading, NewsMeta, ShadowedContainer } from "../..";
import { APINewsDetail } from "../../../api/news/types";

import styles from "./styles.module.scss";

interface Props {
	detail: APINewsDetail;
}

const NewsDetail: FC<Props> = ({ detail }) => {
	return (
		<>
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
		</>
	);
};

export default NewsDetail;
