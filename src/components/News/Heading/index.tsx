import { FC } from "react";
import { Title } from "../..";

import styles from "./styles.module.scss";

interface Props {
	title: string;
}

const NewsHeading: FC<Props> = ({ title }) => {
	return (
		<div className={styles.title}>
			<Title text={title} />
		</div>
	);
};

export default NewsHeading;
