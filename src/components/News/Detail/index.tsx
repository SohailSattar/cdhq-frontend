import { FC } from "react";
import { motion } from "framer-motion";
import {
	Hr,
	NewsContent,
	NewsHeading,
	NewsMeta,
	ShadowedContainer,
} from "../..";
import { APINewsDetail } from "../../../api/news/types";

import styles from "./styles.module.scss";
import clsx from "clsx";

interface Props {
	detail: APINewsDetail;
}

const NewsDetail: FC<Props> = ({ detail }) => {
	return (
		<>
			<motion.div
				className={styles.container}
				initial={{ opacity: 0, y: 50 }} // Adjust initial position and opacity
				animate={{ opacity: 1, y: 0 }} // Adjust animation to y instead of x
				exit={{ opacity: 0, y: -50 }} // Adjust exit to y instead of x
				transition={{
					type: "spring",
					damping: 10,
					stiffness: 500,
					duration: 1,
				}}>
				<NewsHeading title={detail?.title!} />
			</motion.div>
			<Hr />
			<div className={styles.container}>
				<NewsMeta postedDate={new Date(detail?.newsDate!).toDateString()} />
			</div>
			<Hr />

			<ShadowedContainer className={clsx(styles.content)}>
				<motion.div
					className="container"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<motion.div
						initial={{ opacity: 0, y: -10 }} // Adjust initial opacity and position
						animate={{ opacity: 1, y: 0 }} // Adjust animation properties
						exit={{ opacity: 0, y: 10 }} // Adjust exit properties
					>
						<NewsContent
							imagePath={detail?.imageName}
							data={detail?.fullNews!}
						/>
					</motion.div>
				</motion.div>
			</ShadowedContainer>
		</>
	);
};

export default NewsDetail;
