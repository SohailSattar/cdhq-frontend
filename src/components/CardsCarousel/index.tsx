import { FC, Key } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Card } from "..";

import { ICard } from "../Card";

import styles from "./srtles.module.scss";

interface Props {
	data: ICard[];
	showRating?: boolean;
}

const CardsCarousel: FC<Props> = ({ data, showRating = false }) => {
	return (
		<Carousel className={styles.carousel}>
			{data.map((x, index) => (
				<Carousel.Item key={index}>
					<div className={styles.child}>
						<Card
							data={x}
							showRating={showRating}
						/>
					</div>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default CardsCarousel;
