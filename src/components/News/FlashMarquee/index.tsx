import { FC } from "react";
import Marquee from "react-fast-marquee";
import { NewsFlashItem } from "..";

import styles from "./styles.module.scss";
import { APINews } from "../../../api/news/types";

interface Props {
	news: APINews[];
	onClick: any;
}

const NewsFlashMarquee: FC<Props> = ({ news, onClick }) => {
	return (
		<Marquee className={styles.marquee}>
			{news?.map((x) => (
				<NewsFlashItem
					data={x}
					onClick={onClick}
					key={x.id}
				/>
			))}
		</Marquee>
	);
};

export default NewsFlashMarquee;
