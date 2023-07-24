import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";

import styles from "./styles.module.scss";

interface Props {
	onTableBtnClick?: () => void;
}

const CarouselActions: FC<Props> = ({ onTableBtnClick }) => {
	return (
		<div className={styles.carouselActions}>
			<FontAwesomeIcon
				icon={faTableCellsLarge}
				onClick={onTableBtnClick}
				className={styles.icon}
			/>
		</div>
	);
};

export default CarouselActions;
