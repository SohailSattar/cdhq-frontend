import { FC } from "react";
import Card from "react-bootstrap/Card";

import styles from "./styles.module.scss";
import ShadowedContainer from "../../ShadowedContainer";

interface Props {
	imageName: string;
	name: string;
	iconName?: string;
}

const QRCard: FC<Props> = ({ imageName, name, iconName }) => {
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
							<span className={styles.text}>{name}</span>
						</Card.Text>
					</Card.Body>
				</ShadowedContainer>
			</Card>
		</div>
	);
};

export default QRCard;
