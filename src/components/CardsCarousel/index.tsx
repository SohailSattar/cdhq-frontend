import { FC, Fragment, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Card, VideoModal } from "..";

import { ICard } from "../Card";

import styles from "./styles.module.scss";

interface Props {
	data: ICard[];
	showRating?: boolean;
	isScrollable?: boolean;
	displayeModal?: boolean;
}

const CardsCarousel: FC<Props> = ({
	data,
	showRating = false,
	isScrollable = false,
	displayeModal = false,
}) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [filePath, setFilePath] = useState<string>("");

	const handleSelect = (selectedIndex: number, e: any) => {
		setActiveIndex(selectedIndex);
	};

	const cardClickHandler = (path: string) => {
		if (displayeModal) {
			setFilePath(path);
			setIsOpen(true);
		}
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Carousel
				className={styles.carousel}
				activeIndex={activeIndex}
				onSelect={handleSelect}
				prevIcon={
					isScrollable && (
						<span
							className="carousel-control-prev-icon"
							aria-hidden="true"
						/>
					)
				}
				nextIcon={
					isScrollable && (
						<span
							className="carousel-control-next-icon"
							aria-hidden="true"
						/>
					)
				}>
				{data.map((x, index) => (
					<Carousel.Item key={index}>
						<div className={styles.child}>
							<Card
								data={x}
								showRating={showRating}
								className={styles.card}
								onClick={() => cardClickHandler(x.video!)}
							/>
						</div>
					</Carousel.Item>
				))}
			</Carousel>
			<VideoModal
				isOpen={isOpen}
				onClose={closeModal}
				selectedPath={filePath}
			/>
		</>
	);
};

export default CardsCarousel;
