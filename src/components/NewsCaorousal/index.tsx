import { FC, useEffect, useState } from "react";
import { APINews } from "../../api/news/types";
import { NewsBar } from "..";

import styles from "./styles.module.scss";

export interface Props {
	list: APINews[];
	intervalInMiliseconds?: number;
}

const NewsCaorousal: FC<Props> = ({ list, intervalInMiliseconds = 5000 }) => {
	const [newsList, setNewsList] = useState<APINews[]>([]);

	console.log(list.length);

	useEffect(() => {
		setNewsList(list);
		console.log(list.length);
	}, [list]);

	useEffect(() => {
		const interval = setInterval(() => {
			newsList.push(newsList?.shift()!);
			setNewsList((prevState) => [...prevState]);
		}, intervalInMiliseconds);

		return () => clearInterval(interval);
	}, [newsList, setNewsList]);

	return (
		<div className={styles.newsCaorousal}>
			{newsList.map((item: APINews, index) => (
				<div
					className={styles.item}
					key={index}>
					<NewsBar
						data={{
							id: item?.id,
							src: item?.imageName,
							title: item?.title,
							body: item?.shortSummary,
						}}
					/>
				</div>
			))}
		</div>
	);
};

export default NewsCaorousal;
