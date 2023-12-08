import { FC } from "react";

import styles from "./styles.module.scss";
import ReactPlayer from "react-player";

interface Props {
	imagePath?: string;
	videoPath?: string;
	data: string;
}

const NewsContent: FC<Props> = ({ imagePath, videoPath, data }) => {
	return (
		<>
			<div className={styles.thumbnail}>
				{videoPath ? (
					<ReactPlayer
						url={videoPath}
						playing={true}
						width="100%"
						height="600px"
						controls={true}
					/>
				) : (
					imagePath && (
						<img
							src={imagePath}
							alt="thumbnail"
							className={styles.image}
						/>
					)
				)}
				{/* {imagePath && (
					<img
						src={imagePath}
						alt="thumbnail"
						className={styles.image}
					/>
				)} */}
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
