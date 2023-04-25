import { FC } from "react";

import styles from "../../styles.module.scss";

interface Props {
	imagePath?: string;
	data: string;
}

const NewsContent: FC<Props> = ({ imagePath, data }) => {
	return (
		<>
			<div className={styles.thumbnail}>
				<img
					src={imagePath}
					alt="thumbnail"
					className={styles.image}
				/>
			</div>
			<div className={styles.fullNews}>
				{data?.split(/\r?\n/).map((para, index) => (
					<p key={index}>{para}</p>
				))}
			</div>
		</>
	);
};

export default NewsContent;
