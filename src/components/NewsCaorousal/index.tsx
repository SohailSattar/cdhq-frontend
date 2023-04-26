import { FC, useEffect, useState } from "react";
import { APINews } from "../../api/news/types";
import { NewsBar } from "..";

import styles from "./styles.module.scss";
import { useInterval } from "../../hooks/useInterval";

export interface Props {
	list: APINews[];
}

const NewsCaorousal: FC<Props> = ({ list }) => {
	const [newsList, setNewsList] = useState<APINews[]>([]);

	console.log(list.length);

	useEffect(() => {
		setNewsList(list);
		console.log(list.length);
	}, [list]);

	// const intervalRef = useInterval(() => {
	// 	newsList.push(newsList?.shift()!); // results in [1, 2, 3, 4, 5, 6, 7, 8]
	// 	setNewsList(newsList);
	// 	console.log(newsList);
	// }, 5000);

	const shiftCard = () => {};

	useEffect(() => {
		const interval = setInterval(() => {
			newsList.push(newsList?.shift()!); // results in [1, 2, 3, 4, 5, 6, 7, 8]
			setNewsList((prevState) => [...prevState]);
		}, 5000);

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
