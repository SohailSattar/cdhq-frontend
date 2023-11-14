import { FC } from "react";
import ReactCard from "react-bootstrap/Card";
import { Rating } from "@mui/material";

export interface ICard {
	image: string;
	title: string;
	rating?: number;
}

export interface Props {
	data: ICard;
	showRating?: boolean;
	className?: string;
}

const Card: FC<Props> = ({ data, showRating = false, className }) => {
	const { title, image, rating } = data;

	return (
		<ReactCard
			className={className}
			style={{ width: "18rem", textAlign: "center" }}>
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
