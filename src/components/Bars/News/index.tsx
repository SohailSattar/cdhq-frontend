import { FC } from "react";
import { Card } from "react-bootstrap";

import { Id } from "../../../utils";
import { Button } from "../..";

interface NewsItem {
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
		<Card
			dir="rtl"
			style={{
				border: "1px solid #B58934 ",
				backgroundImage: "url('modalBg.png')",
			}}>
			<Card.Header>{title}</Card.Header>
			<Card.Body>
				<Card.Img
					style={{
						border: "2px solid #B58934 ",
						borderRadius: "5px",
						width: "200px",
					}}
					src={src}
				/>
				<Card.Text>{body}</Card.Text>
				<a
					href="#"
					style={{ textDecoration: "none", color: "#B58934" }}>
					المزيد
				</a>
				<Button onClick={() => infoClickHandler(id)}>المزيد</Button>
			</Card.Body>
		</Card>
	);
};

export default NewsBar;
