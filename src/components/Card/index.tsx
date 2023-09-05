import { FC } from "react";
import ReactCard from "react-bootstrap/Card";
import { Rating } from "@mui/material";

import styles from "./styles.module.scss";

export interface ICard {
	image: string;
	title: string;
	rating?: number;
}

export interface Props {
	data: ICard;
	showRating?: boolean;
}

const Card: FC<Props> = ({ data, showRating = false }) => {
	const { title, image, rating } = data;

	console.log(rating);

	return (
		<ReactCard style={{ width: "18rem", textAlign: "center" }}>
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
