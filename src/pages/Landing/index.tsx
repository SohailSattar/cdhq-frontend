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
import { useStore } from "../../utils/store";
import { getCreationsList } from "../../api/creations/get/getCreationsList";
import { getLatest10CreationsList } from "../../api/creations/get/getLatest10CreationsList";

const LandingPage = () => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const [news, setNews] = useState<APINews[]>([]);

	// Honors
	const [empOfMonthCardsList, setEmpOfMonthCardsList] = useState<ICard[]>([]);
	const [skilledEmpsCardsList, setSkilledEmpsCardsList] = useState<ICard[]>([]);

	// Creations
	const [fireDeptCardsList, setFireDeptCardsList] = useState<ICard[]>([]);
	const [servicesDeptCardsList, setServicesDeptCardsList] = useState<ICard[]>(
		[]
	);
	const [creationsCardsList, setCreationsCardsList] = useState<ICard[]>([]);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isNewsTableModalOpen, setIsNewsTableModalOpen] =
		useState<boolean>(false);

	const [newsDetail, setNewsDetail] = useState<APINewsDetail>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest20News();
			if (data) {
				setNews(data!);
			}

			// if (data!) {
			// 	const c: ICard[] = data?.map((x) => {
			// 		return {
			// 			image: x.imageName,
			// 			title: x.title,
			// 			shortSummary: x.shortSummary,
			// 		};
			// 	});
			// }
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
							title: language !== "ar" ? x.name : x.nameEnglish,
						};
					});

				// Employee of the month
				const em: ICard[] = data?.map((x) => {
					return {
						image: x.imageName,
						title: language !== "ar" ? x.name : x.nameEnglish,
					};
				});

				setEmpOfMonthCardsList(em);
				setSkilledEmpsCardsList(se);
			}
		};

		fetch();
	}, [language, setEmpOfMonthCardsList]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest10CreationsList(1);
			if (data!) {
				const fd: ICard[] = data?.map((x) => {
					return {
						image: x.imageName,
						title: language !== "ar" ? x.name : x.nameEnglish,
					};
				});

				setFireDeptCardsList(fd!);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest10CreationsList(2);
			if (data!) {
				const sd: ICard[] = data
					?.filter((x) => x.imageType.id === 2)
					.map((x) => {
						return {
							image: x.imageName,
							title: language !== "ar" ? x.name : x.nameEnglish,
							rating: x.stars!,
						};
					});

				setServicesDeptCardsList(sd!);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest10CreationsList(3);
			if (data!) {
				const cr: ICard[] = data
					?.filter((x) => x.imageType.id === 3)
					.map((x) => {
						return {
							image: x.imageName,
							title: language !== "ar" ? x.name : x.nameEnglish,
						};
					});

				setCreationsCardsList(cr!);
			}
		};

		fetch();
	}, [language]);

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

	console.log(empOfMonthCardsList.length);

	return (
		<div className={styles.landingPage}>
			<div className={styles.newsMarquee}>
				{language !== "ar" && (
					<NewsFlashMarquee
						news={news!}
						onClick={(id: Id) => marqueeItemClickHandler(id)}
					/>
				)}
			</div>
			<div className={clsx("row", styles.container)}>
				<div className={clsx("col-2", styles.sideBar)}>
					{empOfMonthCardsList.length > 0 && (
						<DisplayCard
							title={t("dashboard.employeeOfMonth", { framework: "React" })}
							className={styles.sideBarCard}>
							<CardsCarousel data={empOfMonthCardsList} />
						</DisplayCard>
					)}
					{fireDeptCardsList.length > 0 && (
						<DisplayCard
							title={t("creation.imageType.fireDepartment", {
								framework: "React",
							})}
							className={styles.sideBarCard}>
							<CardsCarousel data={fireDeptCardsList} />
						</DisplayCard>
					)}
					{servicesDeptCardsList.length > 0 && (
						<DisplayCard
							title={t("creation.imageType.servicesDepartment", {
								framework: "React",
							})}
							className={styles.sideBarCard}>
							<CardsCarousel
								data={servicesDeptCardsList}
								showRating
							/>
						</DisplayCard>
					)}
				</div>

				<div className={clsx("col-8", styles.centerContainer)}>
					{news.length > 0 && (
						<NewsCarousel
							list={news}
							intervalInMiliseconds={5000}
							onViewClick={newsDetailClickHandler}
							onTableViewClick={newsListButtonClickHandler!}
						/>
					)}
				</div>

				<div className={clsx("col-2", styles.sideBar)}>
					{skilledEmpsCardsList.length > 0 && (
						<DisplayCard
							title={t("dashboard.honors", { framework: "React" })}
							className={styles.sideBarCard}>
							<CardsCarousel data={skilledEmpsCardsList} />
						</DisplayCard>
					)}
					{creationsCardsList.length > 0 && (
						<DisplayCard
							title={t("creation.imageType.creation", {
								framework: "React",
							})}
							className={styles.sideBarCard}>
							<CardsCarousel data={creationsCardsList} />
						</DisplayCard>
					)}
				</div>
			</div>
			<br />
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
