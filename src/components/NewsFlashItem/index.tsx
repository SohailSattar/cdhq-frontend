import { FC } from "react";
import { APINews } from "../../api/news/types";
import { Id } from "../../utils";

import styles from "./styles.module.scss";

interface Props {
	data: APINews;
	onClick: (id: Id) => void;
}

const NewsFlashItem: FC<Props> = ({ data, onClick }) => {
	return (
		<div className={styles.newsItem} onClick={() => onClick(data.id)}>
			* {data.title}
		</div>
	);
};

export default NewsFlashItem;
