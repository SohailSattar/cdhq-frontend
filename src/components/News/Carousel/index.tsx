import { FC, useEffect, useMemo, useState } from "react";
import $ from "jquery";
import { motion, useAnimationControls } from "framer-motion";

import { APINews } from "../../../api/news/types";

import styles from "./styles.module.scss";
import { Id, rotateRight } from "../../../utils";

import "./styles.css";
import {
	CarouselActions,
	Hr,
	NewsBar,
	NewsTicker,
	ShadowedContainer,
} from "../..";
import clsx from "clsx";

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
	const controls = useAnimationControls();
	const [newsList, setNewsList] = useState<APINews[]>([]);

	useEffect(() => {
		setNewsList(list);
	}, [list]);

	useEffect(() => {
		controls.start({
			y: [-100, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
			opacity: [0, 1, 1],
			height: "100%",
			transition: {
				y: {
					type: "tween",
					duration: 1, // Total duration for the animation (e.g., 2 seconds)
				},
				opacity: { duration: 1 }, // Adjust the duration for opacity
			},
		});
	}, [controls]);

	useEffect(() => {
		const interval = setInterval(() => {
			const lastNewsDiv = $("#newsContainer .newsBar").last();
			lastNewsDiv.hide().prependTo("#newsContainer").slideDown("slow");
		}, intervalInMiliseconds);

		return () => clearInterval(interval);
	}, [intervalInMiliseconds]);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		rotateRight(newsList);
	// 		setNewsList((prevState) => [...prevState]);
	// 		controls.start({
	// 			y: [-100, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
	// 			opacity: [0, 1, 1],
	// 			height: "100%",
	// 			transition: {
	// 				y: {
	// 					type: "tween",
	// 					duration: 1, // Total duration for the animation (e.g., 2 seconds)
	// 				},
	// 				opacity: { duration: 1 }, // Adjust the duration for opacity
	// 			},
	// 		});
	// 	}, intervalInMiliseconds);

	// 	return () => clearInterval(interval);
	// }, [controls, intervalInMiliseconds, newsList, setNewsList]);

	const upArrowClickHandler = useMemo(
		() => async () => {
			// newsList.push(newsList?.shift()!);
			// setNewsList((prevState) => [...prevState]);
			// controls.start({
			// 	y: [100, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
			// 	// opacity: [1, 0.5, 0],
			// 	height: "100%",
			// 	transition: {
			// 		y: {
			// 			type: "tween",
			// 			duration: 1, // Total duration for the animation (e.g., 2 seconds)
			// 		},
			// 		opacity: { duration: 1 }, // Adjust the duration for opacity
			// 	},
			// });
			const firstNewsDiv = $("#newsContainer .newsBar").first();

			firstNewsDiv.slideUp("slow", function () {
				$(this).appendTo("#newsContainer").show("slow");
			});
		},
		[]
	);

	const downArrowClickHandler = useMemo(
		() => async () => {
			// rotateRight(newsList);
			// setNewsList((prevState) => [...prevState]);
			// controls.start({
			// 	y: [-100, 0, 0],
			// 	opacity: [0, 1, 1],
			// 	height: "100%",
			// 	transition: {
			// 		y: {
			// 			type: "tween",
			// 			duration: 1, // Total duration for the animation (e.g., 2 seconds)
			// 		},
			// 		opacity: { duration: 1 }, // Adjust the duration for opacity
			// 	},
			// });
			const lastNewsDiv = $("#newsContainer .newsBar").last();
			lastNewsDiv.hide().prependTo("#newsContainer").slideDown("slow");
		},
		[]
	);

	return (
		<ShadowedContainer className={styles.newsCaorousal}>
			<CarouselActions
				onTableBtnClick={onTableViewClick}
				onDownBtnClick={downArrowClickHandler}
				onUpBtnClick={upArrowClickHandler}
			/>
			<Hr />
			<div id="newsContainer">
				{newsList?.map((item: APINews, index) => (
					<div
						className={clsx(styles.item, "newsBar")}
						key={index}>
						<NewsBar
							id={item?.id}
							src={item?.imageName}
							title={item?.title}
							body={item?.shortSummary}
							onMoreClick={onViewClick}
						/>
					</div>
				))}
			</div>
		</ShadowedContainer>
	);
};

export default NewsCarousel;
