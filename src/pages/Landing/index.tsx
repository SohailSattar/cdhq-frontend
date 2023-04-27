import { useEffect, useState } from "react";
import { getNews } from "../../api/news/get/getNews";
import { APINews, APINewsDetail } from "../../api/news/types";
import { Footer, NewsFlashMarquee } from "../../components";
import NewsCard from "../../components/Cards/NewsCard";
import Menu from "../../components/Menu";
import Marquee from "react-fast-marquee";
import ListGroup from "react-bootstrap/ListGroup";

import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";

import { getLatest20News } from "../../api/news/get/getLatest20News";
import { Id } from "../../utils";
import NewsCaorousal from "../../components/NewsCaorousal";
import clsx from "clsx";

import styles from "./styles.module.scss";

const LandingPage = () => {
	const [news, setNews] = useState<APINews[]>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getLatest20News();
			setNews(data!);
		};

		fetch();
	}, []);

	const marqueeItemClickHandler = (id: Id) => {
		console.log(id);
	};

	return (
		<div className={styles.landingPage}>
			<NewsFlashMarquee
				news={news!}
				onClick={(id: Id) => marqueeItemClickHandler(id)}
			/>
			<div style={{ height: "30px" }}></div>

			<div
				style={{ margin: "auto", width: "95%" }}
				className="row">
				<div
					style={{ textAlign: "center", border: "1px solid black" }}
					className="col-2"></div>

				<div
					// style={{ border: "1px solid black" }}
					className={clsx("col-8", styles.centerContainer)}>
					<NewsCaorousal
						list={news}
						intervalInMiliseconds={5000}
					/>
				</div>

				<div
					style={{ textAlign: "center", border: "1px solid black" }}
					className="col-2">
					<div
						style={{
							borderRadius: "5px",
							marginTop: "5px",
							height: "40px",
							backgroundColor: "#B58934",
							color: "white",
						}}>
						<h4> الموهوبين و المتميزين</h4>
						{/* <h4>{currentText}</h4> */}
					</div>
					<br />

					{/* <NewsCaorousal list={news!} /> */}

					<Carousel style={{ color: "black" }}>
						{news?.map((p, index) => (
							<Carousel.Item key={index}>
								<Card style={{ width: "18rem", textAlign: "center" }}>
									<Card.Img
										style={{
											minHeight: "250px",
											maxHeight: "200px",
											width: "200px",
										}}
										variant="top"
										src={p.imageName}
									/>
									<Card.Body>
										<Card.Title>{p.title}</Card.Title>
										<Card.Text>{p.shortSummary}</Card.Text>
									</Card.Body>
								</Card>
							</Carousel.Item>
						))}
					</Carousel>
				</div>
			</div>

			<div style={{ height: "30px" }}></div>
		</div>
	);
};

export default LandingPage;
