import { FC, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { NewsFlashItem } from "..";

import styles from "./styles.module.scss";
import { APINews } from "../../../api/news/types";
import clsx from "clsx";
import { useStore } from "../../../utils/store";

interface Props {
	news: APINews[];
	onClick: any;
}

const NewsFlashMarquee: FC<Props> = ({ news, onClick }) => {
	// const language = useStore((state) => state.language);

	// const [direction, setDirection] = useState<
	// 	"left" | "right" | "up" | "down" | undefined
	// >();

	// useEffect(() => {
	// 	setDirection(language === "ar" ? "left" : "right");
	// }, [language]);

	return (
		<Marquee
			className={clsx(styles.marquee)}
			direction={"right"}>
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
