import { FC, useEffect, useState } from "react";
import { APINews } from "../../api/news/types";
import { NewsBar, UpDownArrow } from "..";

import styles from "./styles.module.scss";
import { rotateRight } from "../../utils";

export interface Props {
	list: APINews[];
}

const NewsCaorousal: FC<Props> = ({ list }) => {
	const [newsList, setNewsList] = useState<APINews[]>([]);

	useEffect(() => {
		setNewsList(list);
	}, [list]);

	// const intervalRef = useInterval(() => {
	// 	newsList.push(newsList?.shift()!); // results in [1, 2, 3, 4, 5, 6, 7, 8]
	// 	setNewsList(newsList);
	// 	console.log(newsList);
	// }, 5000);

	const shiftCard = () => {};

	useEffect(() => {
		const interval = setInterval(() => {
			rotateRight(newsList);
			setNewsList((prevState) => [...prevState]);
		}, 5000);

		return () => clearInterval(interval);
	}, [newsList, setNewsList]);

	const upArrowClickHandler = () => {
		newsList.push(newsList?.shift()!);
		setNewsList((prevState) => [...prevState]);
	};

	const downArrowClickHandler = () => {
		rotateRight(newsList);

		setNewsList((prevState) => [...prevState]);
	};

	return (
		<div className={styles.newsCaorousal}>
			<div className={styles.arrowContainer}>
				<UpDownArrow
					onUpClick={upArrowClickHandler}
					onDownClick={downArrowClickHandler}
				/>
			</div>
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
