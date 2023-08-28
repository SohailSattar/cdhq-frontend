import { FC } from "react";
import { INewsFormInputs } from "../../Form";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer } from "../..";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";

interface Props {
	data: INewsFormInputs;
	onClick: () => {};
}

const NewsPreview: FC<Props> = ({ data, onClick }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const { department, fullNews, imageName, newsType, shortSummary, title } =
		data;

	return (
		<div>
			<ShadowedContainer>
				<div className={styles.newsPreview}>
					{imageName && (
						<div className={styles.section}>
							<div className={styles.imageContainer}>
								<img
									src={imageName}
									alt="thumb"
									className={styles.image}
								/>
							</div>
						</div>
					)}
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("news.type", { framework: "React" })}
							</div>
							<div className={styles.text}>{newsType?.label! || "N/A"}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("department.name", { framework: "React" })}
							</div>
							<div className={styles.text}>{department?.label! || "N/A"}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("news.title", { framework: "React" })}
							</div>
							<div className={styles.text}>{title}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("news.shortSummary", { framework: "React" })}
							</div>
							<div className={styles.text}>{shortSummary}</div>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.content}>
							<div className={styles.title}>
								{t("news.fullNews", { framework: "React" })}
							</div>
							<div className={styles.text}>{fullNews}</div>
						</div>
					</div>
				</div>
			</ShadowedContainer>
			<div className={styles.btnSection}>
				<span
					className={language !== "ar" ? styles.btnSaveRTL : styles.btnSave}>
					<Button onClick={onClick}>
						{t("button.save", { framework: "React" })}
					</Button>
				</span>
				<Button onClick={onClick}>
					{t("button.cancel", { framework: "React" })}
				</Button>
			</div>
		</div>
	);
};

export default NewsPreview;
