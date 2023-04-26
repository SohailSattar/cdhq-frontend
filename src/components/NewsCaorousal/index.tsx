import { FC } from "react";
import { APINews } from "../../api/news/types";
import NewsCard from "../Cards/NewsCard";

export interface Props {
	list: APINews[];
}

const NewsCaorousal: FC<Props> = ({ list }) => {
	return (
		<div>
			{list.map((item) => (
				<NewsCard
					title={""}
					body={""}
				/>
			))}
		</div>
	);
};

export default NewsCaorousal;
