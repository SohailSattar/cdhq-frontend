import { FC } from "react";
import ReactCard from "react-bootstrap/Card";
import styles from "./styles.module.scss";

export interface ICard {
	image: string;
	title: string;
}

export interface Props {
	data: ICard;
}

const Card: FC<Props> = ({ data }) => {
	const { title, image } = data;

	return (
		<ReactCard style={{ width: "18rem", textAlign: "center" }}>
			<ReactCard.Img
				variant="top"
				src={image}
			/>
			<ReactCard.Body>
				{/* <ReactCard.Title>{title}</ReactCard.Title> */}
				<ReactCard.Text>{title}</ReactCard.Text>
			</ReactCard.Body>
		</ReactCard>
	);
};

export default Card;
