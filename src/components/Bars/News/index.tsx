import { FC } from "react";
import { Card } from "react-bootstrap";

import { Id } from "../../../utils";
import { Button } from "../..";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

export interface NewsItem {
	id: Id;
	title: string;
	body: string;
	src: string;
}

export interface Props {
	data: NewsItem;
}

const NewsBar: FC<Props> = ({ data }) => {
	const { id, title, body, src } = data;

	const infoClickHandler = (id: Id) => {};

	return (
		<Card className={styles.newsBar}>
			<Card.Header>{title}</Card.Header>
			<Card.Body>
				<Card.Img
					src={src}
					className={styles.image}
				/>
				<Card.Text>{body}</Card.Text>
				<a
					href="#"
					className={styles.urlLink}>
					المزيد
				</a>
				<Button onClick={() => infoClickHandler(id)}>المزيد</Button>
			</Card.Body>
		</Card>
	);
};

export default NewsBar;
