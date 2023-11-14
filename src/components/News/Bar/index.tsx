import { FC } from "react";
import { Card } from "react-bootstrap";

import { Id } from "../../../utils";
import { Button } from "../..";

import styles from "./styles.module.scss";

export interface Props {
	id: Id;
	title: string;
	body: string;
	src: string;
	onMoreClick?: (id: Id) => void;
}

const NewsBar: FC<Props> = ({
	id,
	title,
	body,
	src,
	onMoreClick = () => {},
}) => {
	const infoClickHandler = (value: Id) => {
		onMoreClick(value);
	};

	return (
		<Card className={styles.newsBar}>
			<div className={styles.content}>
				<div className={styles.textContainer}>
					<Card.Header className={styles.header}>{title}</Card.Header>
					<Card.Body className={styles.cardBody}>
						<Card.Text className={styles.text}>{body}</Card.Text>
						<Button onClick={() => infoClickHandler(id)}>المزيد</Button>
					</Card.Body>
				</div>
				<div className={styles.imageContainer}>
					<Card.Img
						src={src}
						className={styles.image}
					/>
				</div>
			</div>
		</Card>
	);
};

export default NewsBar;
