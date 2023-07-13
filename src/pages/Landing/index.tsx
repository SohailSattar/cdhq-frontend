import { useEffect, useState } from "react";
import { APINews } from "../../api/news/types";
import {
	DisplayCard,
	NewsFlashMarquee,
	CardsCarousel,
	ShadowedContainer,
} from "../../components";

import { getLatest20News } from "../../api/news/get/getLatest20News";
import { Id } from "../../utils";
import NewsCaorousal from "../../components/NewsCaorousal";
import clsx from "clsx";

import styles from "./styles.module.scss";
import { ICard } from "../../components/Card";
import { getLatest20Honors } from "../../api/honors/get/getLatest20Honors";

const LandingPage = () => {
	const [news, setNews] = useState<APINews[]>([]);

	const [empOfMonthCardsList, setEmpOfMonthCardsList] = useState<ICard[]>([]);
	const [skilledEmpsCardsList, setSkilledEmpsCardsList] = useState<ICard[]>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest20News();
			setNews(data!);

			if (data!) {
				const c: ICard[] = data?.map((x) => {
					return {
						image: x.imageName,
						title: x.title,
						shortSummary: x.shortSummary,
					};
				});
			}
		};

		fetch();
	}, []);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest20Honors();

			if (data!) {
				// Sklled employees
				const se: ICard[] = data
					?.filter((x) => x.type === "موهوب")
					.map((x) => {
						return {
							image: x.imageName,
							title: x.name,
						};
					});

				// Employee of the month
				const em: ICard[] = data?.map((x) => {
					return {
						image: x.imageName,
						title: x.name,
					};
				});

				setEmpOfMonthCardsList(em);
				setSkilledEmpsCardsList(se);
			}
		};

		fetch();
	}, [setEmpOfMonthCardsList]);

	const marqueeItemClickHandler = (id: Id) => {
		console.log(id);
	};

	return (
		<div className={styles.landingPage}>
			<div className={styles.newsMarquee}>
				<NewsFlashMarquee
					news={news!}
					onClick={(id: Id) => marqueeItemClickHandler(id)}
				/>
			</div>
			<div className={clsx("row", styles.container)}>
				<ShadowedContainer className={clsx("col-2", styles.sideBar)}>
					<DisplayCard
						title={"الموظف الموهوب"}
						className={styles.sideBarCard}>
						<CardsCarousel data={skilledEmpsCardsList} />
					</DisplayCard>
				</ShadowedContainer>

				<div className={clsx("col-8", styles.centerContainer)}>
					<NewsCaorousal
						list={news}
						intervalInMiliseconds={5000}
					/>
				</div>

				<ShadowedContainer className={clsx("col-2", styles.sideBar)}>
					<DisplayCard
						title={"الموهوبين و المتميزين"}
						className={styles.sideBarCard}>
						<CardsCarousel data={empOfMonthCardsList} />
					</DisplayCard>
				</ShadowedContainer>
			</div>
			<br />
		</div>
	);
};

export default LandingPage;
