import { FC } from "react";
import ReactCard from "react-bootstrap/Card";
import { Rating } from "@mui/material";

import styles from "./styles.module.scss";
import clsx from "clsx";
import { Id } from "../../utils";

export interface ICard {
	id: Id;
	image: string;
	title: string;
	rating?: number;
	video?: string;
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
	const { title, image, video, rating } = data;

	return (
		<ReactCard
			className={clsx(styles.card, className)}
			onClick={() => onClick(video!)}
			// style={{ width: "18rem", maxWidth: "18rem", textAlign: "center" }}
		>
			<ReactCard.Img
				variant="top"
				src={image}
			/>
			<ReactCard.Body>
				{/* <ReactCard.Title>{title}</ReactCard.Title> */}
				<ReactCard.Text>{title}</ReactCard.Text>
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
