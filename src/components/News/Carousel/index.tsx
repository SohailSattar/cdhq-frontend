import { FC, useEffect, useMemo, useRef, useState } from "react";
// import { useTransition, animated } from "@react-spring/web";
// import { useListTransition } from "transition-hook";
import { motion, useAnimationControls } from "framer-motion";

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
	const controls = useAnimationControls();
	const [newsList, setNewsList] = useState<APINews[]>([]);
	const [direction, setDirection] = useState<string>("down");

	useEffect(() => {
		setNewsList(list);
	}, [list]);

	useEffect(() => {
		controls.start({
			y: [-50, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
			opacity: [0, 0.5, 1],
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
			rotateRight(newsList);
			setNewsList((prevState) => [...prevState]);
			controls.start({
				y: [-50, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
				opacity: [0, 0.5, 1],
				height: "100%",
				transition: {
					y: {
						type: "tween",
						duration: 1, // Total duration for the animation (e.g., 2 seconds)
					},
					opacity: { duration: 1 }, // Adjust the duration for opacity
				},
			});
		}, intervalInMiliseconds);

		return () => clearInterval(interval);
	}, [controls, intervalInMiliseconds, newsList, setNewsList]);

	const upArrowClickHandler = useMemo(
		() => async () => {
			newsList.push(newsList?.shift()!);
			setNewsList((prevState) => [...prevState]);
			setDirection("up");
			controls.start({
				y: [50, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
				opacity: [0, 0.5, 1],
				height: "100%",
				transition: {
					y: {
						type: "tween",
						duration: 1, // Total duration for the animation (e.g., 2 seconds)
					},
					opacity: { duration: 1 }, // Adjust the duration for opacity
				},
			});
			// controls.start({
			// 	y: [150, 0, 0],
			// 	opacity: 1,
			// 	height: "100%",
			// 	transition: {
			// 		y: [0, -30, 0],
			// 		// duration: 3,
			// 		// type: "spring",
			// 		// stiffness: 1000,
			// 		// damping: "10",
			// 		// ease: [0, 0.71, 0.2, 1.01],
			// 	},
			// });
		},
		[controls, newsList]
	);

	const downArrowClickHandler = useMemo(
		() => async () => {
			rotateRight(newsList);
			setNewsList((prevState) => [...prevState]);
			setDirection("down");
			controls.start({
				y: [-50, 0, 0], // Keyframes for y: [-150, 0, -150, 0]
				opacity: [0, 0.5, 1],
				height: "100%",
				transition: {
					y: {
						type: "tween",
						duration: 1, // Total duration for the animation (e.g., 2 seconds)
					},
					opacity: { duration: 1 }, // Adjust the duration for opacity
				},
			});
			// controls.start({
			// 	y: 0, // Start from y: 0
			// 	opacity: 1,
			// 	height: "100%",
			// 	transition: {
			// 		y: {
			// 			type: "tween",
			// 			from: -150, // Start from y: -150
			// 			to: 0, // End at y: 0
			// 			duration: 0.5, // Adjust the duration here (e.g., 1 second)
			// 		},
			// 		opacity: { duration: 1 }, // Adjust the duration for opacity
			// 	},
			// });
			// controls.start({
			// 	y: [-100, 0, 0],
			// 	opacity: 1,
			// 	height: "100%",
			// 	// transition: {
			// 	// 	y: [-100, 0, 0],
			// 	// 	// duration: 1,
			// 	// 	delay: 0.02,
			// 	// 	// type: "spring",
			// 	// 	// stiffness: 1000,
			// 	// 	// damping: "10",
			// 	// 	// ease: [0, 0.71, 0.2, 1.01],
			// 	// },
			// 	transition: {
			// 		y: {
			// 			type: "spring", // You can use spring for smoother animations
			// 			stiffness: 500,
			// 			damping: 10,
			// 		},
			// 		opacity: { duration: 1 }, // Adjust the duration here (e.g., 0.3 seconds)
			// 	},
			// });
		},
		[controls, newsList]
	);

	return (
		<ShadowedContainer className={styles.newsCaorousal}>
			<div>
				<CarouselActions
					onTableBtnClick={onTableViewClick}
					onDownBtnClick={downArrowClickHandler}
					onUpBtnClick={upArrowClickHandler}
				/>
			</div>
			{/* {newsList.length > 0 && (
				<motion.div
					animate={{ x: 0, opacity: 1, height: "auto" }}
					className={styles.arrowContainer}>
					<UpDownArrow
						onUpClick={upArrowClickHandler}
						onDownClick={downArrowClickHandler}
					/>
				</motion.div>
			)} */}
			{newsList?.map((item: APINews, index) => (
				<motion.div
					className={styles.item}
					key={index}
					// initial={{ x: 0, opacity: 0, height: 0 }}
					// initial="initial"
					// animate={{ x: 0, opacity: 1, height: "auto" }}
					// animate="animate"
					// animate={direction === "down" ? "animate" : "animateUp"}
					// transition={{ duration: 1, delay: index * 0.2 }}
					// transition="transition"
					// key={index}
					// exit={{
					// 	x: -50,
					// 	opacity: 0,
					// 	transition: { duration: 1, delay: 0.5 * (5 - index) },
					// 	height: 0,
					// }}
					// variants={shiftVariants}
					animate={controls}>
					<NewsBar
						id={item?.id}
						src={item?.imageName}
						title={item?.title}
						body={item?.shortSummary}
						onMoreClick={onViewClick}
					/>
				</motion.div>
			))}
		</ShadowedContainer>
	);
};

export default NewsCarousel;
