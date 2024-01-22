// Card.tsx

import React, { FC } from "react";
import ReactCard from "react-bootstrap/Card";
import { Rating } from "@mui/material";

import styles from "./styles.module.scss";
import clsx from "clsx";
import { Id } from "../../utils";
import Hr from "../Hr";

export interface ICard {
	id: Id;
	image: string;
	title: string;
	department?: string;
	rating?: number;
	video?: string;
	notes?: string;
}

export interface Props {
	data: ICard;
	showRating?: boolean;
	className?: string;
	onClick?: (id: Id) => void;
}

const Card: FC<Props> = ({
	data,
	showRating = false,
	className,
	onClick = () => {},
}) => {
	const { title, department, image, video, rating, notes } = data;

	return (
		<ReactCard
			className={clsx(styles.card, className)}
			onClick={() => onClick(video!)}>
			<ReactCard.Img
				variant="top"
				src={image}
			/>
			<ReactCard.Body>
				{notes! && notes! !== "" ? (
					<section className={styles.section}>
						<div className={styles.textContainer}>
							<h2>{title}</h2>
							<p>
								{
									"Plenty of pools and activities to keep children smiling, plus comfy apartments that are tailored for families."
								}
							</p>
							<a href="#">Learn more</a>
						</div>
					</section>
				) : (
					<>
						<ReactCard.Text>{title}</ReactCard.Text>

						{department && (
							<>
								<Hr />
								<ReactCard.Text>{department}</ReactCard.Text>
							</>
						)}
					</>
				)}
				{showRating && (
					<Rating
						value={rating}
						readOnly
						size="large"
					/>
				)}
			</ReactCard.Body>
		</ReactCard>
	);
};

export default Card;
