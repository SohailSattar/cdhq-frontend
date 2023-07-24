import { FC, Key } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Card } from "..";

import { ICard } from "../Card";

import styles from "./srtles.module.scss";

interface Props {
	data: ICard[];
}

const CardsCarousel: FC<Props> = ({ data }) => {
	return (
		<Carousel className={styles.carousel}>
			{data.map((x, index) => (
				<Carousel.Item key={index}>
					<div className={styles.child}>
						<Card data={x} />
					</div>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default CardsCarousel;
