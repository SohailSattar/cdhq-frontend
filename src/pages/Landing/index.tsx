import { useEffect, useMemo, useState } from "react";
import { APINews, APINewsDetail } from "../../api/news/types";
import {
	DisplayCard,
	NewsFlashMarquee,
	CardsCarousel,
	ShadowedContainer,
	Modal,
	NewsDetail,
	NewsList,
} from "../../components";

import { getLatest20News } from "../../api/news/get/getLatest20News";
import { Id } from "../../utils";
import { NewsCarousel } from "../../components";
import clsx from "clsx";

import styles from "./styles.module.scss";
import { ICard } from "../../components/Card";
import { getLatest20Honors } from "../../api/honors/get/getLatest20Honors";
import { getNewsDetail } from "../../api/news/get/getNewsDetail";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
	const [t] = useTranslation("common");
	const [news, setNews] = useState<APINews[]>([]);

	const [empOfMonthCardsList, setEmpOfMonthCardsList] = useState<ICard[]>([]);
	const [skilledEmpsCardsList, setSkilledEmpsCardsList] = useState<ICard[]>([]);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isNewsTableModalOpen, setIsNewsTableModalOpen] =
		useState<boolean>(false);

	const [newsDetail, setNewsDetail] = useState<APINewsDetail>();

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

	const fetchNewsDetail = useMemo(
		() => async (id: Id) => {
			const { data } = await getNewsDetail(id);

			if (data) {
				setNewsDetail(data);
			}
		},
		[]
	);

	const marqueeItemClickHandler = (id: Id) => {
		setIsModalOpen(true);
		fetchNewsDetail(id);
	};

	const newsListButtonClickHandler = async () => {
		setIsNewsTableModalOpen(true);
	};

	const modalNewsListCloseHandler = () => {
		setIsNewsTableModalOpen(false);
	};

	const newsDetailClickHandler = async (id: Id) => {
		setIsModalOpen(true);
		fetchNewsDetail(id);
	};

	const modalCloseHandler = () => {
		setIsModalOpen(false);
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
						title={t("dashboard.honors", { framework: "React" })}
						className={styles.sideBarCard}>
						<CardsCarousel data={skilledEmpsCardsList} />
					</DisplayCard>
				</ShadowedContainer>

				<div className={clsx("col-8", styles.centerContainer)}>
					<NewsCarousel
						list={news}
						intervalInMiliseconds={5000}
						onViewClick={newsDetailClickHandler}
						onTableViewClick={newsListButtonClickHandler!}
					/>
				</div>

				<ShadowedContainer className={clsx("col-2", styles.sideBar)}>
					<DisplayCard
						title={t("dashboard.employeeOfMonth", { framework: "React" })}
						className={styles.sideBarCard}>
						<CardsCarousel data={empOfMonthCardsList} />
					</DisplayCard>
				</ShadowedContainer>
			</div>
			<br />
			<Modal
				isOpen={isNewsTableModalOpen}
				onClose={modalNewsListCloseHandler}
				className={styles.modal}>
				<NewsList onViewClick={newsDetailClickHandler} />
			</Modal>
			<Modal
				isOpen={isModalOpen}
				onClose={modalCloseHandler}
				className={styles.modal}>
				<NewsDetail detail={newsDetail!} />
			</Modal>{" "}
		</div>
	);
};

export default LandingPage;
