import { FC, useEffect, useState } from "react";
import { APINews } from "../../api/news/types";
import { NewsBar, UpDownArrow } from "..";

import styles from "./styles.module.scss";

import { rotateRight } from "../../utils";

export interface Props {
	list: APINews[];
	intervalInMiliseconds?: number;
}

const NewsCaorousal: FC<Props> = ({ list, intervalInMiliseconds = 5000 }) => {
	const [newsList, setNewsList] = useState<APINews[]>([]);

	useEffect(() => {
		setNewsList(list);
	}, [list]);

	useEffect(() => {
		const interval = setInterval(() => {
			rotateRight(newsList);
			setNewsList((prevState) => [...prevState]);
		}, intervalInMiliseconds);

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
