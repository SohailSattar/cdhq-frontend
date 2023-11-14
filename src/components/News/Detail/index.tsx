import { FC } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { enGB, ar } from "date-fns/locale";
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
import { useStore } from "../../../utils/store";

interface Props {
	detail: APINewsDetail;
}

const NewsDetail: FC<Props> = ({ detail }) => {
	const language = useStore((state) => state.language);
	return (
		<>
			<motion.div
				className={styles.container}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -50 }}
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
				<NewsMeta
					postedDate={
						detail?.newsDate!
							? format(new Date(detail?.newsDate!), "dd MMMM yyyy", {
									locale: language !== "ar" ? ar : enGB,
							  })
							: ""
					}
				/>
			</div>
			<Hr />

			<ShadowedContainer className={clsx(styles.content)}>
				<motion.div
					className="container"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}>
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
