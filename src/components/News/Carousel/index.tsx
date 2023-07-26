import { FC, useEffect, useRef, useState } from "react";
// import { useTransition, animated } from "@react-spring/web";
import { useListTransition } from "transition-hook";

import { APINews } from "../../../api/news/types";

import styles from "./styles.module.scss";
import { Id, rotateRight } from "../../../utils";

import "./styles.css";
import {
	CarouselActions,
	NewsBar,
	ShadowedContainer,
	UpDownArrow,
} from "../..";

export interface Props {
	list: APINews[];
	intervalInMiliseconds?: number;
	onViewClick?: (id: Id) => void;
	onTableViewClick?: () => void;
}

const NewsCarousel: FC<Props> = ({
	list,
	intervalInMiliseconds = 5000,
	onViewClick,
	onTableViewClick,
}) => {
	const timeoutRef = useRef(300);
	const transition = useListTransition(list, timeoutRef.current);
	// const [rows, set] = useState(list);
	const [newsList, setNewsList] = useState<APINews[]>([]);

	let height = 0;
	const boxHeight = 150;

	// const transitions = useTransition(
	// 	newsList.map((data) => ({ ...data, y: (height += boxHeight) - boxHeight })),
	// 	{
	// 		key: (item: any) => item.name,
	// 		from: { height: 0, opacity: 0 },
	// 		leave: { height: 0, opacity: 0 },
	// 		enter: ({ y }) => ({ y, boxHeight, opacity: 1 }),
	// 		update: ({ y }) => ({ y, boxHeight }),
	// 		exitBeforeEnter: true,
	// 	}
	// );

	// const transition = useTransition(newsList, {
	// 	from: {
	// 		opacity: 0,
	// 	},
	// 	enter: {
	// 		opacity: 1,
	// 	},
	// 	leave: {
	// 		opacity: 0,
	// 	},
	// 	exitBeforeEnter: true,
	// });

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
	console.log(newsList);

	return (
		<ShadowedContainer className={styles.newsCaorousal}>
			<div>
				<CarouselActions onTableBtnClick={onTableViewClick} />
			</div>
			{newsList.length > 0 && (
				<div className={styles.arrowContainer}>
					<UpDownArrow
						onUpClick={upArrowClickHandler}
						onDownClick={downArrowClickHandler}
					/>
				</div>
			)}

			{newsList.map((item: APINews, index) => (
				<div className={styles.item}>
					<NewsBar
						id={item?.id}
						src={item?.imageName}
						title={item?.title}
						body={item?.shortSummary}
						onMoreClick={onViewClick}
					/>
				</div>
			))}
		</ShadowedContainer>
	);
};

export default NewsCarousel;
