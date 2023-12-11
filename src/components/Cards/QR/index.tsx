import { FC } from "react";
import Card from "react-bootstrap/Card";

import ShadowedContainer from "../../ShadowedContainer";
import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import clsx from "clsx";

interface Props {
	imageName: string;
	name: string;
	iconName?: string;
}

const QRCard: FC<Props> = ({ imageName, name, iconName }) => {
	const language = useStore((state) => state.language);

	return (
		<div className={styles.qrCode}>
			<Card>
				<ShadowedContainer className={styles.container}>
					<Card.Body>
						<Card.Img
							className={styles.image}
							src={imageName}
						/>
						<Card.Text className={styles.txtContainer}>
							{iconName && (
								<span>
									<img
										src={iconName}
										alt={name}
										className={styles.iconName}
									/>
								</span>
							)}
							<span
								className={clsx(
									styles.text,
									language !== "ar" && styles.textRTL
								)}>
								{" "}
								{name}
							</span>
						</Card.Text>
					</Card.Body>
				</ShadowedContainer>
			</Card>
		</div>
	);
};

export default QRCard;
