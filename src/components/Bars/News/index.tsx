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
			<Card.Header>{title}</Card.Header>
			<Card.Body>
				<Card.Img
					src={src}
					className={styles.image}
				/>
				<Card.Text>{body}</Card.Text>

				<Button onClick={() => infoClickHandler(id)}>المزيد</Button>

				{/* <RedirectButton
					label={"المزيد"}
					redirectTo={RoutePath.NEWS_DETAIL.replace(":id", id.toString())}
				/> */}
			</Card.Body>
		</Card>
	);
};

export default NewsBar;
