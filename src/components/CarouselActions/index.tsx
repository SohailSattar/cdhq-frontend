import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTableCellsLarge,
	faArrowDown,
	faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
// import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";

import styles from "./styles.module.scss";
import clsx from "clsx";
import { useStore } from "../../utils/store";

interface Props {
	onTableBtnClick?: () => void;
	onDownBtnClick?: () => void;
	onUpBtnClick?: () => void;
}

const CarouselActions: FC<Props> = ({
	onTableBtnClick,
	onDownBtnClick,
	onUpBtnClick,
}) => {
	const language = useStore((state) => state.language);

	return (
		<div className={styles.carouselActions}>
			<FontAwesomeIcon
				icon={faTableCellsLarge}
				onClick={onTableBtnClick}
				className={styles.icon}
			/>
			<FontAwesomeIcon
				icon={faArrowUp}
				onClick={onUpBtnClick}
				className={clsx(
					styles.icon,
					language !== "ar" ? styles.icon2_RTL : styles.icon2
				)}
			/>
			<FontAwesomeIcon
				icon={faArrowDown}
				onClick={onDownBtnClick}
				className={clsx(
					styles.icon,
					language !== "ar" ? styles.icon2_RTL : styles.icon2
				)}
			/>
		</div>
	);
};

export default CarouselActions;
